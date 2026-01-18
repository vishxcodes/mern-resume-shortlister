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


export default router;
