import express from "express";
import Application from "../models/application.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { rankingQueue } from "../jobs/queue.js";
import { sendStatusEmail } from "../utils/emailService.js";

const router = express.Router();

// 🧩 Apply for a Job (Candidate Only)
router.post("/apply/:jobId", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const candidateId = req.user._id;
    const jobId = req.params.jobId;

    // ✅ Ensure job exists
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // ✅ Ensure candidate has a resume
    const resume = await Resume.findOne({ userId: candidateId });
    if (!resume) {
      return res.status(400).json({ error: "Please upload your resume before applying." });
    }

    // ✅ Prevent duplicate applications
    const existingApp = await Application.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    // ✅ Create a new application
    const newApplication = new Application({
      jobId,
      candidateId,
      status: "applied",
    });

    await newApplication.save();

    res.status(201).json({
      message: "Application submitted successfully!",
      application: newApplication,
    });
  } catch (err) {
    console.error("Error applying for job:", err);
    res.status(500).json({ error: err.message });
  }
});


// ✅ Get all applications of logged-in candidate
router.get("/my-applications", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const candidateId = req.user._id;

    const applications = await Application.find({ candidateId })
      .populate("jobId", "title description role type location experienceLevel recruiterId")
      .populate("resumeId", "fileUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: err.message });
  }
});


// ➤ Recruiter: View applicants for a specific job
router.get("/job/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate("candidateId", "name email")
      .populate("resumeId", "fileUrl");
    res.json(apps);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all applicants for jobs posted by the recruiter
router.get("/recruiter", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    // Find all jobs owned by this recruiter
    const recruiterJobs = await Job.find({ recruiterId: req.user._id }).select("_id title");

    if (recruiterJobs.length === 0)
      return res.status(200).json([]); // No jobs posted by this recruiter

    const jobIds = recruiterJobs.map((job) => job._id);

    // Find all applications linked to the recruiter’s jobs
    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("jobId", "title")
      .populate("candidateId", "name email")
      .populate("resumeId", "fileUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching recruiter applicants:", err);
    res.status(500).json({ error: err.message });
  }
});


// ➤ Update application status (Recruiter only)
router.patch("/:applicationId/status", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    console.log("🔹 PATCH request received for Application:", applicationId);
    console.log("🔹 New Status:", status);
    console.log("🔹 Recruiter:", req.user?._id);

    const validStatuses = ["applied", "shortlisted", "rejected", "accepted"];
    if (!validStatuses.includes(status)) {
      console.log("❌ Invalid status:", status);
      return res.status(400).json({ error: "Invalid status value" });
    }

    const application = await Application.findById(applicationId)
      .populate("jobId", "recruiterId title")
      .populate("candidateId", "email name");

    if (!application) {
      console.log("❌ Application not found");
      return res.status(404).json({ error: "Application not found" });
    }

    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      console.log("❌ Unauthorized recruiter");
      return res.status(403).json({ error: "Unauthorized" });
    }

    // ✅ Update status
    application.status = status;
    await application.save();
    console.log("✅ Status updated successfully");

    // ✅ Email Notifications for shortlisted, accepted, rejected
    const candidateEmail = application.candidateId.email;
    const candidateName = application.candidateId.name;
    const jobTitle = application.jobId.title;

    if (["shortlisted", "accepted", "rejected"].includes(status)) {
      let subject, message;

      switch (status) {
        case "shortlisted":
          subject = `🎉 You've been shortlisted for ${jobTitle}`;
          message = `Hi ${candidateName},\n\nGood news! You've been *shortlisted* for the "${jobTitle}" position.\n\nOur team was impressed by your profile, and you may be contacted soon for the next steps.\n\nBest of luck!\n\n– Resume Shortlister Team`;
          break;

        case "accepted":
          subject = `✅ Congratulations! You’ve been accepted for ${jobTitle}`;
          message = `Hi ${candidateName},\n\nWe’re excited to inform you that your application for "${jobTitle}" has been *accepted* by the recruiter!\n\nCongratulations and best wishes for your new role 🎉\n\n– Resume Shortlister Team`;
          break;

        case "rejected":
          subject = `📢 Update on your application for ${jobTitle}`;
          message = `Hi ${candidateName},\n\nWe wanted to let you know that your application for "${jobTitle}" was not selected at this stage.\n\nPlease don’t be discouraged — many factors are considered in selection, and we encourage you to apply again in the future.\n\nBest wishes,\nResume Shortlister Team`;
          break;

        default:
          break;
      }

      try {
        await sendStatusEmail(candidateEmail, subject, message);
        console.log(`📧 ${status.toUpperCase()} email sent successfully to ${candidateEmail}`);
      } catch (mailErr) {
        console.error("❌ Failed to send status email:", mailErr.message);
      }
    }

    res.json({ message: "Application status updated", application });
  } catch (err) {
    console.error("❌ Error updating application status:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Rank applicants for a job using your TF-IDF algorithm
router.get("/rank/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { jobId } = req.params;

    // ✅ 1. Verify job ownership
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to rank this job’s applicants" });
    }

    // ✅ 2. Get all applications for this job
    const applications = await Application.find({ jobId })
      .populate("candidateId", "name email")
      .populate("resumeId", "fileUrl extractedText")
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(200).json([]);
    }

    // ✅ 3. Prepare resume data for TF-IDF
    const resumesData = applications.map((app) => ({
      id: app._id,
      text: app.resumeId?.extractedText || "",
    }));

    // ✅ 4. Run your existing TF-IDF ranking algorithm
    const ranked = await rankResumes(job.description, resumesData);

    // ✅ 5. Attach scores back to applicants
    const rankedApplicants = applications.map((app) => {
      const rankInfo = ranked.find((r) => r.id.toString() === app._id.toString());
      return {
        ...app.toObject(),
        matchScore: rankInfo ? rankInfo.score.toFixed(3) : 0,
      };
    });

    // ✅ 6. Sort by match score (descending)
    rankedApplicants.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json(rankedApplicants);
  } catch (err) {
    console.error("❌ Error ranking applicants:", err);
    res.status(500).json({ error: err.message });
  }
});


export default router;
