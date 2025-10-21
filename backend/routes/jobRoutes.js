import express from "express";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { rankResumes } from "../utils/tfidf.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

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

export default router;
