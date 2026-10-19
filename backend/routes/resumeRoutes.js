import fs from "fs";
import path from "path";
import express from "express";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import upload from "../middleware/uploadMiddleware.js";
import Resume from "../models/Resume.js";
import cloudinary from "../config/cloudinary.js";
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

      // 1️⃣ Extract text from buffer (PDF or DOCX/DOC)
      let extractedText = "";
      const ext = path.extname(req.file.originalname).toLowerCase();
      try {
        if (ext === ".pdf") {
          const pdfData = await pdfParse(req.file.buffer);
          extractedText = pdfData.text ? pdfData.text.trim() : "";
        } else if (ext === ".docx" || ext === ".doc") {
          const result = await mammoth.extractRawText({ buffer: req.file.buffer });
          extractedText = result.value ? result.value.trim() : "";
        }
      } catch (parseErr) {
        console.warn("Text extraction warning:", parseErr.message);
      }

      // 2️⃣ Upload file (Cloudinary if valid credentials exist, else local storage fallback)
      let resumeUrl = "";
      let fileUrl = "";

      const hasCloudinary =
        Boolean(process.env.CLOUDINARY_CLOUD_NAME) &&
        Boolean(process.env.CLOUDINARY_API_KEY) &&
        Boolean(process.env.CLOUDINARY_API_SECRET) &&
        !process.env.CLOUDINARY_CLOUD_NAME.includes("process.env") &&
        !process.env.CLOUDINARY_CLOUD_NAME.includes("<your-");

      if (hasCloudinary) {
        try {
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
          resumeUrl = uploadResult.secure_url;
          fileUrl = uploadResult.secure_url;
        } catch (cloudErr) {
          console.warn("Cloudinary upload failed, falling back to local file storage:", cloudErr.message);
        }
      }

      // Local storage fallback
      if (!resumeUrl) {
        const uploadsDir = path.join(process.cwd(), "uploads");
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }
        const safeName = `${Date.now()}-${req.file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_")}`;
        const filePath = path.join(uploadsDir, safeName);
        fs.writeFileSync(filePath, req.file.buffer);

        const port = process.env.PORT || 8000;
        fileUrl = `uploads/${safeName}`;
        resumeUrl = `http://localhost:${port}/uploads/${safeName}`;
      }

      // 3️⃣ Save or update resume record in DB (one resume per candidate)
      let resume = await Resume.findOne({ userId: req.user._id });
      if (resume) {
        resume.resumeUrl = resumeUrl;
        resume.fileUrl = fileUrl;
        resume.extractedText = extractedText;
        await resume.save();
      } else {
        resume = await Resume.create({
          userId: req.user._id,
          resumeUrl,
          fileUrl,
          extractedText,
        });
      }

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

// ➤ Delete current user's resume
router.delete(
  "/me",
  protect,
  authorizeRoles("candidate"),
  async (req, res) => {
    try {
      const resume = await Resume.findOneAndDelete({ userId: req.user._id });
      if (!resume) {
        return res.status(404).json({ message: "No resume found to delete" });
      }
      res.json({ message: "Resume deleted successfully" });
    } catch (err) {
      console.error("Resume delete error:", err);
      res.status(500).json({ error: err.message });
    }
  }
);

export default router;
