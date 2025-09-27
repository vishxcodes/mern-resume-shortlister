import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  recruiterId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  title: { type: String, required: true },
  description: { type: String, required: true }, // this will be compared against resumes
}, { timestamps: true });

export default mongoose.model("Job", jobSchema);
