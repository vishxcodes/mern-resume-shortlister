import { Worker } from "bullmq";
import { rankResumes } from "../utils/tfidf.js";
import Job from "../models/Job.js";
import Application from "../models/application.js";
import Resume from "../models/Resume.js";
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();
mongoose.connect(process.env.MONGO_URI);

const connection = { host: "127.0.0.1", port: 6379 };

const worker = new Worker(
  "rankingQueue",
  async (job) => {
    const { jobId } = job.data;

    console.log(`Running background ranking for job: ${jobId}`);

    const jobDoc = await Job.findById(jobId);
    if (!jobDoc) throw new Error("Job not found");

    const applications = await Application.find({ jobId }).populate("resumeId", "extractedText");

    const resumesData = applications.map((a) => ({
      id: a._id,
      text: a.resumeId?.extractedText || "",
    }));

    const ranked = await rankResumes(jobDoc.description, resumesData);

    // Update top 3 as shortlisted
    const topThree = ranked.slice(0, 3).map((r) => r.id);
    await Application.updateMany(
      { _id: { $in: topThree } },
      { $set: { status: "shortlisted" } }
    );

    console.log(`✅ Ranking completed for job ${jobId}. Top 3 auto-shortlisted.`);
  },
  { connection }
);
