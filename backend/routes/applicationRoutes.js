import express from "express";
import Application from "../models/application.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { sendEmail, sendApplicationSubmittedEmails, sendStatusEmail } from "../utils/emailService.js";
import { rankResumes } from "../utils/tfidf.js";

const router = express.Router();

/* ============================
   APPLY FOR A JOB (CANDIDATE)
============================ */
router.post("/apply/:jobId", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const candidateId = req.user._id;
    const { jobId } = req.params;

    const job = await Job.findById(jobId).populate("recruiterId", "name email");
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

    // 📧 Asynchronously send application confirmation & recruiter alert
    sendApplicationSubmittedEmails({
      candidateEmail: req.user.email,
      candidateName: req.user.name,
      jobTitle: job.title,
      recruiterEmail: job.recruiterId?.email,
    }).catch((emailErr) => {
      console.error("⚠️ Background application email notice error:", emailErr.message);
    });

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
      .populate("resumeId", "fileUrl resumeUrl")
      .sort({ createdAt: -1 });

    res.status(200).json(applications);
  } catch (err) {
    console.error("Error fetching applications:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   RECRUITER: ALL APPLICANTS
============================ */
router.get("/recruiter", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const jobs = await Job.find({ recruiterId: req.user._id }, "_id");
    const jobIds = jobs.map((j) => j._id);

    const applications = await Application.find({ jobId: { $in: jobIds } })
      .populate("candidateId", "name email")
      .populate("resumeId", "fileUrl resumeUrl")
      .populate("jobId", "title role location type")
      .sort({ createdAt: -1 });

    res.json(applications);
  } catch (err) {
    console.error("Error fetching recruiter applications:", err);
    res.status(500).json({ error: err.message });
  }
});

/* ============================
   RECRUITER: VIEW APPLICANTS FOR A JOB
============================ */
router.get("/job/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const apps = await Application.find({ jobId: req.params.jobId })
      .populate("candidateId", "name email")
      .populate("resumeId", "fileUrl resumeUrl")
      .populate("jobId", "title role location type");

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

      // 📧 Send status notification email to candidate
      const candidateEmail = application.candidateId?.email;
      const candidateName = application.candidateId?.name || "Candidate";
      const jobTitle = application.jobId?.title || "Position";

      if (["shortlisted", "accepted", "rejected"].includes(status) && candidateEmail) {
        let subject = "";
        let message = "";
        let htmlBody = "";

        if (status === "shortlisted") {
          subject = `🎉 You've been shortlisted for ${jobTitle}`;
          message = `Hi ${candidateName},

Good news! You have been shortlisted for the "${jobTitle}" position.
The recruiter will review top matches and may contact you soon for next steps.

Best of luck!
The Auto Resume Shortlister Team`;

          htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
              <h2 style="color: #10b981; margin-top: 0;">🎉 You've Been Shortlisted!</h2>
              <p>Hi <strong>${candidateName}</strong>,</p>
              <p>Great news! Your qualifications and resume scored highly in our candidate matching system for the <strong>${jobTitle}</strong> position.</p>
              <p>The recruiter has placed your profile on the shortlisted candidate roster and will reach out with interview details.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
                Auto Resume Shortlister • Talent Matching Platform
              </div>
            </div>
          `;
        }

        if (status === "accepted") {
          subject = `✅ Application Accepted: ${jobTitle}`;
          message = `Hi ${candidateName},

Congratulations! Your application for "${jobTitle}" has been accepted.
The hiring team will reach out with onboarding and offer details.

Best wishes!
The Auto Resume Shortlister Team`;

          htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
              <h2 style="color: #059669; margin-top: 0;">✅ Offer / Accepted</h2>
              <p>Hi <strong>${candidateName}</strong>,</p>
              <p>Congratulations! Your application for <strong>${jobTitle}</strong> has been accepted by the hiring manager.</p>
              <p>The team will contact you directly with next steps.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
                Auto Resume Shortlister
              </div>
            </div>
          `;
        }

        if (status === "rejected") {
          subject = `Update on your application for ${jobTitle}`;
          message = `Hi ${candidateName},

Thank you for your interest in "${jobTitle}". After careful consideration, the hiring team has decided to move forward with other candidates at this time.
We appreciate your time and wish you the best in your job search.

Sincerely,
The Auto Resume Shortlister Team`;

          htmlBody = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; border: 1px solid #e4e4e7; border-radius: 8px;">
              <h2 style="color: #3f3f46; margin-top: 0;">Application Status Update</h2>
              <p>Hi <strong>${candidateName}</strong>,</p>
              <p>Thank you for your interest and the time you invested in applying for <strong>${jobTitle}</strong>.</p>
              <p>After reviewing all candidates, the hiring team has chosen to proceed with other applicants whose experience more closely matches their current requirements.</p>
              <p>We encourage you to explore other openings on our platform.</p>
              <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e4e4e7; font-size: 12px; color: #71717a;">
                Auto Resume Shortlister
              </div>
            </div>
          `;
        }

        sendEmail({
          to: candidateEmail,
          subject,
          text: message,
          html: htmlBody,
        }).catch((mailErr) => {
          console.error("❌ Email sending failed:", mailErr.message);
        });
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
