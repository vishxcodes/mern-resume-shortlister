import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";
import pdfParse from "pdf-parse";
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

      // 1️⃣ Extract text from PDF buffer
      const pdfData = await pdfParse(req.file.buffer);
      const extractedText = pdfData.text.trim();


      console.log("Cloudinary active:", cloudinary.config().cloud_name)
      // 2️⃣ Upload PDF buffer to Cloudinary
      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: "raw",
            folder: "resumes",
          },
          (error, result) => {
            if (error) reject(error);
            else resolve(result);
          }
        ).end(req.file.buffer);
      });

      // 3️⃣ Save resume data to DB
      const resume = await Resume.create({
        userId: req.user._id,
        resumeUrl: uploadResult.secure_url,
        extractedText,
      });

      res.status(201).json({
        message: "Resume uploaded successfully",
        resume,
      });
    } catch (err) {
      console.error("Resume upload error:", err);
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
