import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RankedResumes = () => {
  const [jobs, setJobs] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await axios.get("http://localhost:8000/api/jobs");
        const recruiterJobs = data.filter(
          (job) => job.recruiterId._id === user._id
        );
        setJobs(recruiterJobs);
      } catch (error) {
        console.error(error);
      }
    };
    fetchJobs();
  }, [user._id]);

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Ranked Resumes
      </h2>

      {jobs.length === 0 ? (
        <p className="text-gray-600">No jobs posted yet.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="flex justify-between items-center border border-gray-200 p-3 rounded-md hover:bg-gray-50 transition"
            >
              <span className="font-medium text-gray-700">{job.title}</span>
              <button
                onClick={() => navigate(`/recruiter/rank/${job._id}`)}
                className="bg-gray-800 text-white px-3 py-1 rounded hover:bg-gray-900 transition"
              >
                Rank
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default RankedResumes;
