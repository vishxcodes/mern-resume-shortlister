import mongoose from "mongoose";

const applicationSchema = new mongoose.Schema(
  {
    jobId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
      required: true,
    },
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    resumeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resume",
      required: false, // ✅ Make this optional
    },
    status: {
      type: String,
      enum: ["applied", "shortlisted", "rejected", "accepted"], // ✅ Make sure these match your usage
      default: "applied",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Application", applicationSchema);
