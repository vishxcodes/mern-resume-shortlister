import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  fileUrl: { type: String },       // if storing file path
  extractedText: { type: String }, // resume text for TF-IDF
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
