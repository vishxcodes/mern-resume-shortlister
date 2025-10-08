import express from "express";
import Job from "../models/Job.js";
import Resume from "../models/Resume.js";
import { rankResumes } from "../utils/tfidf.js";

const router = express.Router();

// ➤ Create a new Job
router.post("/", async (req, res) => {
  try {
    const { recruiterId, title, description } = req.body;

    if (!recruiterId || !title || !description) {
      return res.status(400).json({ error: "recruiterId, title and description are required" });
    }

    const job = new Job({ recruiterId, title, description });
    await job.save();
    res.status(201).json(job);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get all jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find().populate("recruiterId", "name email");
    res.json(jobs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Get job by ID
router.get("/:id", async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).populate("recruiterId", "name email");
    if (!job) return res.status(404).json({ error: "Job not found" });
    res.json(job);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ➤ Rank resumes against a job description (TF-IDF)
router.get("/rank/:jobId", async (req, res) => {
  try {
    const job = await Job.findById(req.params.jobId);
    if (!job) return res.status(404).json({ error: "Job not found" });

    const resumes = await Resume.find({}).select("extractedText userId");
    const resumesData = resumes.map(r => ({ id: r._id, text: r.extractedText }));

    const ranked = await rankResumes(job.description, resumesData);

    res.json({ jobId: job._id, rankedResumes: ranked });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
