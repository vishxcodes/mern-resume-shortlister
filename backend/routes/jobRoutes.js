// routes/jobRoutes.js
import express from "express";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import Application from "../models/application.js"; // make sure this exists in your models folder
import { rankResumes } from "../utils/tfidf.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js"; // adapt path if needed

const router = express.Router();

// ➤ Create a new Job (recruiter)
router.post("/", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { title, description, role, type, location, experienceLevel } = req.body;

    // 🧩 Basic validation
    if (!title || !description) {
      return res
        .status(400)
        .json({ error: "Title and description are required" });
    }

    // recruiterId automatically comes from logged-in user
    const job = new Job({
      recruiterId: req.user._id,
      title,
      description,
      role: role || "Other", // ✅ default fallback values
      type: type || "Remote",
      location: location || "Remote",
      experienceLevel: experienceLevel || "Internship",
    });

    await job.save();

    res.status(201).json({
      message: "Job created successfully",
      job,
    });
  } catch (err) {
    console.error("Error creating job:", err);
    res.status(500).json({ error: err.message });
  }
});

// 📍 Get recommended jobs for the logged-in candidate
router.get("/recommended", protect, authorizeRoles("candidate"), async (req, res) => {
  try {
    const userId = req.user._id;

    // 🧠 Fetch candidate’s resume text
    const resume = await Resume.findOne({ userId });
    if (!resume || !resume.extractedText) {
      return res.status(404).json({ error: "Upload a resume to get recommendations." });
    }

    const allJobs = await Job.find();
    // Simple text-based similarity (basic version)
    const recommendations = allJobs
      .map((job) => {
        const text = job.description.toLowerCase();
        const resumeText = resume.extractedText.toLowerCase();

        // basic overlap score
        const commonWords = resumeText
          .split(/\W+/)
          .filter((word) => word.length > 3 && text.includes(word));

        return { ...job._doc, score: commonWords.length };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 5); // top 5 jobs

    res.json(recommendations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Rank resumes for a job (Recruiter Only)
router.get("/rank/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Ensure recruiter owns the job
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "You are not authorized to view this job’s resumes" });
    }

    const resumes = await Resume.find({}).select("extractedText userId");
    const resumesData = resumes.map((r) => ({ id: r._id, text: r.extractedText }));

    const ranked = await rankResumes(job.description, resumesData);
    res.json({ jobId: job._id, rankedResumes: ranked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// DELETE single job (recruiter only)
router.delete("/:jobId", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { jobId } = req.params;
    const job = await Job.findById(jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    // Ownership check
    if (job.recruiterId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ error: "Unauthorized" });
    }

    // Delete related applications (if Application model exists)
    try {
      await Application.deleteMany({ jobId: job._id });
    } catch (appErr) {
      console.warn("Application model delete failed or Application model missing:", appErr.message);
      // continue — don't block job deletion if application deletion fails
    }

    // Delete the job
    await job.deleteOne();

    res.json({ message: "Job and related applications deleted", jobId: job._id });
  } catch (err) {
    console.error("Error deleting job:", err);
    res.status(500).json({ error: err.message });
  }
});

// Bulk delete jobs (recruiter only)
router.post("/bulk-delete", protect, authorizeRoles("recruiter"), async (req, res) => {
  try {
    const { ids } = req.body;
    if (!Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: "No job ids provided" });
    }

    // Verify ownership: fetch jobs and ensure all belong to recruiter
    const jobs = await Job.find({ _id: { $in: ids } });

    // check all exists and owned
    for (const job of jobs) {
      if (job.recruiterId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ error: "Unauthorized to delete one or more jobs" });
      }
    }

    // Delete related applications for those jobs
    try {
      await Application.deleteMany({ jobId: { $in: ids } });
    } catch (appErr) {
      console.warn("Application model bulk delete failed or Application model missing:", appErr.message);
    }

    // Delete the jobs themselves
    await Job.deleteMany({ _id: { $in: ids } });

    res.json({ message: "Selected jobs deleted" });
  } catch (err) {
    console.error("Error bulk deleting jobs:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all jobs (with filters/search)
router.get("/", async (req, res) => {
  try {
    const { search, role, type, location, experienceLevel } = req.query;
    const query = {};

    // 🔍 Full-text search on title/description
    if (search && search.trim() !== "") {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    // 🎯 Case-insensitive filter matching
    if (role && role.trim() !== "") {
      query.role = { $regex: new RegExp(role, "i") };
    }
    if (type && type.trim() !== "") {
      query.type = { $regex: new RegExp(type, "i") };
    }
    if (location && location.trim() !== "") {
      query.location = { $regex: new RegExp(location, "i") };
    }
    if (experienceLevel && experienceLevel.trim() !== "") {
      query.experienceLevel = { $regex: new RegExp(experienceLevel, "i") };
    }

    console.log("Applied query:", query); // 👈 for debugging

    const jobs = await Job.find(query).populate("recruiterId", "name email");
    res.status(200).json(jobs);
  } catch (err) {
    console.error("Error fetching jobs:", err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get job by ID (Public)
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
