import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema({
  candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
  resumeId: { type: mongoose.Schema.Types.ObjectId, ref: "Resume", required: true },
  status: { type: String, enum: ["applied", "shortlisted", "rejected", "accepted"], default: "applied" }
}, { timestamps: true });

export default mongoose.model("Application", applicationSchema);
