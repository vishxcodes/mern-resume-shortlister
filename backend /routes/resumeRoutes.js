import express from "express";
import Resume from "../models/Resume.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Upload resume
// POST /api/resumes/upload/:userId
router.post("/upload/:userId", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    const newResume = new Resume({
      userId: req.params.userId,
      fileUrl: req.file.path
    });

    await newResume.save();
    res.json({ message: "Resume uploaded successfully", resume: newResume });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
