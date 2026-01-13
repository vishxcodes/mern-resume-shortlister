import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  resumeUrl: { type: String },
extractedText: { type: String },
  extractedText: { type: String }, // resume text for TF-IDF
}, { timestamps: true });

export default mongoose.model("Resume", resumeSchema);
