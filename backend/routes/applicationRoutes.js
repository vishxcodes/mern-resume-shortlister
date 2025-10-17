import express from "express";
import Application from "../models/Application.js";
import Resume from "../models/Resume.js";
import Job from "../models/Job.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➤ Apply to a job (Candidate only)
router.post("/apply/:jobId", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const candidateId = req.user._id;
    const { jobId } = req.params;
    const { resumeId } = req.body; // resume ID selected or uploaded

    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const existing = await Application.findOne({ candidateId, jobId });
    if (existing) return res.status(400).json({ error: "Already applied to this job" });

    const application = new Application({ candidateId, jobId, resumeId });
    await application.save();

    res.status(201).json({ message: "Application submitted successfully", application });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all applications of a candidate
router.get("/my-applications", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const apps = await Application.find({ candidateId: req.user._id })
      .populate("jobId", "title description")
      .populate("resumeId", "fileUrl");
    res.json(apps);
  } catch (err) {
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

export default router;
