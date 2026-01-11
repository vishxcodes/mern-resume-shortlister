// scripts/backfillResumeId.js
import dotenv from "dotenv";
dotenv.config();

import mongoose from "mongoose";
import Application from "../models/application.js";
import Resume from "../models/Resume.js";

// adjust connection helper if you have one; otherwise use MONGO_URI
const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/yourdb";

async function main() {
  await mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  console.log("Connected to DB");

  // find apps missing resumeId
  const apps = await Application.find({ $or: [{ resumeId: { $exists: false } }, { resumeId: null }] });
  console.log(`Found ${apps.length} applications without resumeId.`);

  let updated = 0;
  let notFound = 0;

  for (const app of apps) {
    const candidateId = app.candidateId;
    const resume = await Resume.findOne({ userId: candidateId });

    if (resume) {
      app.resumeId = resume._id;
      await app.save();
      updated++;
      console.log(`Updated application ${app._id} -> resumeId ${resume._id}`);
    } else {
      notFound++;
      console.warn(`No resume found for candidate ${candidateId} (application ${app._id})`);
    }
  }

  console.log(`Done. Updated: ${updated}, No resume found: ${notFound}`);
  await mongoose.disconnect();
  process.exit(0);
}

main().catch(err => {
  console.error("Migration error:", err);
  process.exit(1);
});
