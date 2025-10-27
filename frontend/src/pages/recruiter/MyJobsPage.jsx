import React, { useEffect, useState } from "react";
import axios from "axios";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";
import { useNavigate } from "react-router-dom";

const MyJobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/jobs");
        const myJobs = data.filter((job) => job.recruiterId._id === user._id);
        setJobs(myJobs);
      } catch (err) {
        console.error(err);
      }
    };
    fetchJobs();
  }, [user._id]);

  return (
    <RecruiterLayout>
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          My Posted Jobs
        </h1>

        {jobs.length === 0 ? (
          <div className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow text-gray-600 dark:text-gray-300 text-center">
            You haven’t posted any jobs yet.
          </div>
        ) : (
          <div className="grid gap-5">
            {jobs.map((job) => (
              <div
                key={job._id}
                className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-1">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                      {job.description.length > 100
                        ? job.description.slice(0, 100) + "..."
                        : job.description}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs">
                      Posted on:{" "}
                      {new Date(job.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>

                  <button
                    onClick={() => navigate(`/recruiter/rank/${job._id}`)}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium transition"
                  >
                    View Ranked Resumes
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </RecruiterLayout>
  );
};

export default MyJobsPage;
