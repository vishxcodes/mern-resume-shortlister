import express from "express";
import Application from "../models/application.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { sendStatusEmail } from "../utils/emailService.js";
import { rankResumes } from "../utils/tfidf.js";

const router = express.Router();

/* ============================
   APPLY FOR A JOB (CANDIDATE)
============================ */
router.post("/apply/:jobId", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const candidateId = req.user._id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const resume = await Resume.findOne({ userId: candidateId });
    if (!resume) {
      return res.status(400).json({ error: "Please upload your resume before applying." });
    }

    const existingApp = await Application.findOne({ jobId, candidateId });
    if (existingApp) {
      return res.status(400).json({ error: "You have already applied for this job." });
    }

    const newApplication = new Application({
      jobId,
      candidateId,
      resumeId: resume._id,
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

/* ============================
   CANDIDATE: MY APPLICATIONS
============================ */
router.get("/my-applications", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const applications = await Application.find({ candidateId: req.user._id })
      .populate("jobId", "title description role type location experienceLevel")
      .populate("resumeId", "fileUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   RECRUITER: VIEW APPLICANTS
============================ */
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

/* ============================
   RECRUITER: STATUS CHANGE
============================ */
router.patch(
  "/:applicationId/status",
  protect,
  authorizeRoles("recruiter"),
  async (req, res) => {
    try {
      const { applicationId } = req.params;
      const { status } = req.body;

      console.log("🔹 PATCH application:", applicationId);
      console.log("🔹 New status:", status);

      // Allowed statuses
      const validStatuses = ["applied", "shortlisted", "rejected", "accepted"];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ error: "Invalid status value" });
      }

      // Find application
      const application = await Application.findById(applicationId)
        .populate("jobId", "recruiterId title")
        .populate("candidateId", "name email");

      if (!application) {
        return res.status(404).json({ error: "Application not found" });
      }

      // Ensure recruiter owns the job
      if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized" });
      }

      // Update status
      application.status = status;
      await application.save();

      console.log("✅ Application status updated");

      // Optional: send email to candidate
      const candidateEmail = application.candidateId.email;
      const candidateName = application.candidateId.name;
      const jobTitle = application.jobId.title;

      if (["shortlisted", "accepted", "rejected"].includes(status)) {
        let subject = "";
        let message = "";

        if (status === "shortlisted") {
          subject = `🎉 You've been shortlisted for ${jobTitle}`;
          message = `Hi ${candidateName},

Good news! You have been shortlisted for the "${jobTitle}" position.

The recruiter may contact you soon for next steps.

Best of luck!
– Resume Shortlister Team`;
        }

        if (status === "accepted") {
          subject = `✅ You’ve been accepted for ${jobTitle}`;
          message = `Hi ${candidateName},

Congratulations! Your application for "${jobTitle}" has been accepted.

Best wishes for your new role 🎉
– Resume Shortlister Team`;
        }

        if (status === "rejected") {
          subject = `📢 Update on your application for ${jobTitle}`;
          message = `Hi ${candidateName},

Thank you for applying to "${jobTitle}". Unfortunately, your application was not selected at this time.

We encourage you to apply again in the future.

Best regards,
Resume Shortlister Team`;
        }

        try {
          await sendStatusEmail(candidateEmail, subject, message);
          console.log(`📧 Email sent to ${candidateEmail}`);
        } catch (mailErr) {
          console.error("❌ Email sending failed:", mailErr.message);
        }
      }

      res.json({
        message: "Application status updated successfully",
        application,
      });
    } catch (err) {
      console.error("❌ Error updating application status:", err);
      res.status(500).json({ error: err.message });
    }
  }
);


/* ============================
   RECRUITER: RANK APPLICANTS
============================ */
router.get("/rank/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { jobId } = req.params;

    // 1️⃣ Verify job + ownership
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Not authorized to rank applicants for this job" });
    }

    // 2️⃣ Fetch applications
    const applications = await Application.find({ jobId })
      .populate("candidateId", "name email")
      .populate("resumeId", "extractedText")
      .sort({ createdAt: -1 });

    if (applications.length === 0) {
      return res.status(200).json({ jobId, applicants: [], skipped: [] });
    }

    // 3️⃣ Prepare resume data
    const resumesData = [];
    const skipped = [];

    for (const app of applications) {
      const resume = app.resumeId;
      const resumeId = resume?._id?.toString();
      const text = resume?.extractedText?.trim() || "";

      if (!resumeId || !text) {
        skipped.push(app._id.toString());
        continue;
      }

      resumesData.push({ id: resumeId, text });
    }

    if (resumesData.length === 0) {
      return res.status(200).json({
        jobId,
        applicants: [],
        skipped,
        message: "No readable resumes available for ranking.",
      });
    }

    // 4️⃣ Run TF-IDF
    const ranked = await rankResumes(job.description, resumesData);

    // 5️⃣ Map resumeId → score
    const scoreMap = new Map();
    ranked.forEach(r => {
      scoreMap.set(String(r.id), Number(r.score) || 0);
    });

    // 6️⃣ Attach percentage scores
    const applicantsWithScore = applications.map(app => {
      const resumeId = app.resumeId?._id?.toString();
      const rawScore = resumeId && scoreMap.has(resumeId) ? scoreMap.get(resumeId) : 0;
      const percentage = rawScore * 100;

      return {
        ...app.toObject(),
        matchScore: percentage,                       // number (for sorting)
        matchScoreDisplay: `${percentage.toFixed(1)}%`, // string (for UI)
      };
    });

    // 7️⃣ Sort by match percentage
    applicantsWithScore.sort((a, b) => b.matchScore - a.matchScore);

    res.status(200).json({
      jobId,
      applicants: applicantsWithScore,
      skipped,
    });
  } catch (err) {
    console.error("❌ Error ranking applicants:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
