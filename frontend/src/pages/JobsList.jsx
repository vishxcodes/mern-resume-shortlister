import { useEffect, useState } from "react";
import API from "../api/axiosInstance";

export default function JobsList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="p-6 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-100">
      <h2 className="text-base font-semibold mb-4 text-white">Available Jobs</h2>
      {jobs.length === 0 ? (
        <p className="text-xs text-zinc-500">No jobs available right now.</p>
      ) : (
        <div className="space-y-3">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="border border-zinc-800 p-4 rounded-lg bg-zinc-950/70"
            >
              <h3 className="font-semibold text-sm text-zinc-200">{job.title}</h3>
              <p className="text-xs text-zinc-400 mt-1">{job.description}</p>
              <div className="text-[11px] text-zinc-500 mt-2 font-mono">
                Posted by: {job.recruiterId?.name || "Verified Organization"}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
