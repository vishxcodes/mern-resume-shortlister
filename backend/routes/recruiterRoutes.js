import express from "express";
import Job from "../models/Job.js";
import Application from "../models/application.js";
import { protect, authorizeRoles } from "../middleware/authMiddleware.js";

const router = express.Router();

// 🔹 STEP 2: Recruiter dashboard stats (LIVE DATA ONLY)
router.get(
  "/dashboard-stats",
  protect,
  authorizeRoles("recruiter"),
  async (req, res) => {
    try {
      const recruiterId = req.user._id;

      // 🔍 DEBUG
      console.log("Recruiter ID:", recruiterId);

      // ✅ INCLUDE old jobs that don't have status yet
      const activeJobs = await Job.find(
        {
          recruiterId,
          $or: [{ status: "open" }, { status: { $exists: false } }],
        },
        "_id"
      );

      console.log("Active jobs count:", activeJobs.length);

      const activeJobIds = activeJobs.map((job) => job._id);

      const totalApplicants = await Application.countDocuments({
        jobId: { $in: activeJobIds },
      });

      const shortlistedCandidates = await Application.countDocuments({
        jobId: { $in: activeJobIds },
        status: "shortlisted",
      });

      res.json({
        totalActiveJobs: activeJobs.length,
        totalApplicants,
        shortlistedCandidates,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/recruiter/recent-activity
router.get(
  "/recent-activity",
  protect,
  authorizeRoles("recruiter"),
  async (req, res) => {
    try {
      const recruiterId = req.user._id;

      // 1️⃣ Get recruiter's active jobs
      const jobs = await Job.find(
        {
          recruiterId,
          $or: [{ status: "open" }, { status: { $exists: false } }],
        },
        "_id title"
      );

      const jobMap = {};
      jobs.forEach(job => {
        jobMap[job._id.toString()] = job.title;
      });

      const jobIds = jobs.map(job => job._id);

      // 2️⃣ Get latest applications
      const applications = await Application.find({
        jobId: { $in: jobIds },
      })
        .sort({ createdAt: -1 })
        .limit(5)
        .populate("candidateId", "name")
        .populate("jobId", "title");

      // 3️⃣ Format activity feed
      const activity = applications.map(app => ({
        type:
          app.status === "shortlisted"
            ? "shortlisted"
            : "applied",
        candidateName: app.candidateId?.name || "Candidate",
        jobTitle: app.jobId?.title || "Job",
        time: app.createdAt,
      }));
      

      res.json(activity);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);

// GET /api/recruiter/active-jobs
router.get(
  "/active-jobs",
  protect,
  authorizeRoles("recruiter"),
  async (req, res) => {
    try {
      const recruiterId = req.user._id;

      // 1️⃣ Get active jobs
      const jobs = await Job.find(
        {
          recruiterId,
          $or: [{ status: "open" }, { status: { $exists: false } }],
        },
        "title createdAt"
      ).sort({ createdAt: -1 });

      const jobIds = jobs.map(job => job._id);

      // 2️⃣ Get application counts per job
      const applications = await Application.aggregate([
        {
          $match: {
            jobId: { $in: jobIds },
          },
        },
        {
          $group: {
            _id: "$jobId",
            totalApplicants: { $sum: 1 },
            shortlisted: {
              $sum: {
                $cond: [{ $eq: ["$status", "shortlisted"] }, 1, 0],
              },
            },
          },
        },
      ]);

      // 3️⃣ Map counts to jobs
      const statsMap = {};
      applications.forEach(item => {
        statsMap[item._id.toString()] = {
          totalApplicants: item.totalApplicants,
          shortlisted: item.shortlisted,
        };
      });

      const result = jobs.map(job => ({
        _id: job._id,
        title: job.title,
        status: "open",
        totalApplicants: statsMap[job._id]?.totalApplicants || 0,
        shortlisted: statsMap[job._id]?.shortlisted || 0,
      }));

      res.json(result);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  }
);



export default router;
