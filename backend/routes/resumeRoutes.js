import express from "express";
import fs from "fs";
import Resume from "../models/Resume.js";
import upload from "../middleware/uploadMiddleware.js";
import { extractTextFromFile } from "../utils/extractText.js";

const router = express.Router();

// Upload resume
// POST /api/resumes/upload/:userId
router.post("/upload/:userId", upload.single("resume"), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });
    console.log("File uploaded:", req.file);
    console.log("File path:", req.file.path);
    // 1. Get file path
    const filePath = req.file.path;

    // 2. Extract text using your utility
    const extractedText = await extractTextFromFile(filePath);
    console.log("Extracted text:", extractedText);
    // 3. Save in DB
    const newResume = new Resume({
      userId: req.params.userId,
      fileUrl: filePath,
      extractedText: extractedText || ""   // <-- now saved in MongoDB
    });

    await newResume.save();
    res.json({ message: "Resume uploaded successfully", resume: newResume });
  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ error: err.message });
  }
});

export default router;
