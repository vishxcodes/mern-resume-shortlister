import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";

export default function RecruiterOverview() {
  const [stats, setStats] = useState({
    totalActiveJobs: 0,
    totalApplicants: 0,
    shortlistedCandidates: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        const { data } = await API.get("/recruiter/dashboard-stats");
        setStats(data);
      } catch (error) {
        console.error("Failed to fetch recruiter dashboard stats", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardStats();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
        Dashboard Overview
      </h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">
          Loading latest statistics...
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Jobs */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-gray-100">
              Active Jobs
            </h2>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400 mt-2">
              {stats.totalActiveJobs}
            </p>
          </div>

          {/* Applicants */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-gray-100">
              Total Applicants
            </h2>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400 mt-2">
              {stats.totalApplicants}
            </p>
          </div>

          {/* Shortlisted */}
          <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700">
            <h2 className="text-lg font-semibold dark:text-gray-100">
              Shortlisted Candidates
            </h2>
            <p className="text-3xl font-bold text-purple-600 dark:text-purple-400 mt-2">
              {stats.shortlistedCandidates}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
