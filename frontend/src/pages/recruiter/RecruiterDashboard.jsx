import React, { useEffect, useState } from "react";
import axios from "axios";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import { useNavigate } from "react-router-dom";

const RecruiterDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [totalRankedResumes, setTotalRankedResumes] = useState(0);
  const [loading, setLoading] = useState(true);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/jobs");
        const myJobs = data.filter((job) => job.recruiterId._id === user._id);
        setJobs(myJobs);

        // Optional: count ranked resumes (mock for now)
        setTotalRankedResumes(myJobs.length * 5); // Example value
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [user._id]);

  if (loading)
    return (
      <RecruiterLayout>
        <div className="text-center py-10 text-gray-600 dark:text-gray-300">
          Loading dashboard...
        </div>
      </RecruiterLayout>
    );

  return (
    <RecruiterLayout>
      <div className="max-w-6xl mx-auto">
        {/* Dashboard Header */}
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          Recruiter Dashboard
        </h1>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {/* Total Jobs Posted */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Total Jobs Posted
            </h3>
            <p className="text-3xl font-bold text-blue-600 dark:text-blue-400">
              {jobs.length}
            </p>
          </div>

          {/* Total Ranked Resumes */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Total Ranked Resumes
            </h3>
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {totalRankedResumes}
            </p>
          </div>

          {/* Last Job Posted */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow border border-gray-100 dark:border-gray-700">
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">
              Last Job Posted
            </h3>
            <p className="text-xl font-semibold text-gray-800 dark:text-gray-100">
              {jobs.length > 0
                ? jobs[jobs.length - 1].title
                : "No jobs yet"}
            </p>
            {jobs.length > 0 && (
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {new Date(jobs[jobs.length - 1].createdAt).toLocaleDateString(
                  "en-IN"
                )}
              </p>
            )}
          </div>
        </div>

        {/* Recent Jobs Section */}
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 border border-gray-100 dark:border-gray-700">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-gray-100">
              Recent Jobs
            </h2>
            <button
              onClick={() => navigate("/recruiter/my-jobs")}
              className="text-blue-600 dark:text-blue-400 hover:underline"
            >
              View All →
            </button>
          </div>

          {jobs.length === 0 ? (
            <p className="text-gray-500 dark:text-gray-400">
              You haven’t posted any jobs yet.
            </p>
          ) : (
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {jobs.slice(-3).reverse().map((job) => (
                <div
                  key={job._id}
                  className="py-3 flex justify-between items-center"
                >
                  <div>
                    <h3 className="text-gray-800 dark:text-gray-100 font-medium">
                      {job.title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {job.description.length > 80
                        ? job.description.slice(0, 80) + "..."
                        : job.description}
                    </p>
                  </div>
                  <button
                    onClick={() => navigate(`/recruiter/rank/${job._id}`)}
                    className="text-sm bg-blue-600 hover:bg-blue-700 text-white px-3 py-1.5 rounded-md transition"
                  >
                    View Rankings
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </RecruiterLayout>
  );
};

export default RecruiterDashboard;
