import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6 rounded-xl bg-white shadow-lg border border-gray-100">
      <h2 className="text-lg font-semibold mb-2">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available right now.</p>
      ) : (
        jobs.map((job) => (
          <div
            key={job._id}
            className="border p-3 mb-2 rounded bg-white shadow-sm"
          >
            <h3 className="font-bold text-gray-800">{job.title}</h3>
            <p className="text-gray-700">{job.description}</p>
            <small className="text-gray-500">
              Posted by: {job.recruiterId?.name || "Unknown"}
            </small>
          </div>
        ))
      )}
    </div>
  );
}
