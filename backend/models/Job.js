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

    // Flexible fields for filtering/searching
    role: {
      type: String,
      default: "Other",
    },
    type: {
      type: String,
      default: "Remote",
    },
    location: {
      type: String,
      default: "Remote",
    },
    experienceLevel: {
      type: String,
      default: "Internship",
    },
    status: {
      type: String,
      enum: ["open", "closed"],
      default: "open",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Job", jobSchema);
