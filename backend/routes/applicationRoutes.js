import express from "express";
import Application from "../models/application.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";
import { rankingQueue } from "../jobs/queue.js";
import { sendStatusEmail } from "../utils/emailService.js";
import User from "../models/User.js";

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
      status: "Applied",
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

// ➤ Update application status (Recruiter only)
router.patch("/:applicationId/status", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { applicationId } = req.params;
    const { status } = req.body;

    const validStatuses = ["applied", "shortlisted", "rejected", "accepted"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: "Invalid status value" });
    }

    const application = await Application.findById(applicationId)
      .populate("jobId", "recruiterId title")
      .populate("candidateId", "email name");

    if (!application) return res.status(404).json({ error: "Application not found" });

    // Only recruiter who owns the job can update it
    if (application.jobId.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    application.status = status;
    await application.save();

    // ✅ Send email only on recruiter decision (accepted/rejected)
    if (["accepted", "rejected"].includes(status)) {
      const subject =
        status === "accepted"
          ? `Congratulations! You've been accepted for ${application.jobId.title}`
          : `Update on your application for ${application.jobId.title}`;
      const message =
        status === "accepted"
          ? `Hi ${application.candidateId.name},\n\nYour application for "${application.jobId.title}" has been accepted by the recruiter. Congratulations!`
          : `Hi ${application.candidateId.name},\n\nUnfortunately, your application for "${application.jobId.title}" was not selected at this stage.\n\nWe wish you the best in your career journey.`;
      await sendStatusEmail(application.candidateId.email, subject, message);
    }

    res.json({ message: "Application status updated", application });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



export default router;
