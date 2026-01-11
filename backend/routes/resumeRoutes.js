import express from "express";
import Resume from "../models/Resume.js";
import upload from "../middleware/uploadMiddleware.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// ➤ Upload resume (Candidate Only)
router.post(
  "/upload",
  protect,
  authorizeRoles("candidate"),
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      /**
       * 🔥 IMPORTANT:
       * Fully dynamic runtime-only import
       * Prevents Vercel from bundling pdf-parse / mammoth at build time
       */
      const extractorModule = await import(
        new URL("../utils/extractText.js", import.meta.url)
      );
      const extractTextFromFile = extractorModule.extractTextFromFile;

      const extractedText = await extractTextFromFile(req.file);

      const newResume = new Resume({
        userId: req.user._id,
        extractedText: extractedText || "",
      });

      await newResume.save();

      res.status(201).json({
        message: "Resume uploaded successfully",
        resume: newResume,
      });
    } catch (err) {
      console.error("Error uploading resume:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

// ➤ Get current user's resume
router.get(
  "/me",
  protect,
  authorizeRoles("candidate"),
  async (req, res) => {
    try {
      const resume = await Resume.findOne({ userId: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: "No resume found" });
      }
      res.json({ resume });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
