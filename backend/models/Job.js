import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    recruiterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: { type: String, required: true },
    description: { type: String, required: true },

    // 🧭 New fields for filtering/searching
    role: {
      type: String,
      enum: ["Frontend", "Backend", "Full Stack", "Data Science", "Marketing", "Other"],
      default: "Other",
    },
    type: {
      type: String,
      enum: ["Remote", "On-site", "Hybrid"],
      default: "Remote",
    },
    location: {
      type: String,
      default: "Remote",
    },
    experienceLevel: {
      type: String,
      enum: ["Internship", "Fresher", "Junior", "Mid", "Senior"],
      default: "Internship",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
