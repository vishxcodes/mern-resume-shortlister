import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { BriefcaseIcon, ArrowRightIcon } from "lucide-react";

export default function ActiveJobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/recruiter/active-jobs");
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch active jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-5">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-sm font-semibold text-white">Active Positions</h2>
          <p className="text-xs text-zinc-500">Live applicant metrics for your posted jobs</p>
        </div>
        <button
          onClick={() => navigate("/recruiter/jobs")}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1 transition"
        >
          <span>All Jobs</span>
          <ArrowRightIcon className="w-3 h-3" />
        </button>
      </div>

      {loading ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          Loading active jobs...
        </div>
      ) : jobs.length === 0 ? (
        <div className="py-8 text-center text-xs text-zinc-500">
          <BriefcaseIcon className="w-8 h-8 text-zinc-700 mx-auto mb-2" />
          <p>No active jobs posted yet.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="border-b border-zinc-800/80 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
              <tr>
                <th className="pb-3 font-medium">Job Title</th>
                <th className="pb-3 font-medium">Applicants</th>
                <th className="pb-3 font-medium">Shortlisted</th>
                <th className="pb-3 font-medium">Status</th>
                <th className="pb-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-800/50">
              {jobs.map((job) => (
                <tr
                  key={job._id}
                  className="hover:bg-zinc-900/40 transition"
                >
                  <td className="py-3 font-medium text-zinc-200">{job.title}</td>
                  <td className="py-3 text-zinc-400 font-mono">{job.totalApplicants}</td>
                  <td className="py-3 text-zinc-400 font-mono">{job.shortlisted}</td>
                  <td className="py-3">
                    <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Open
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <button
                      onClick={() =>
                        navigate(`/recruiter/applicants?jobId=${job._id}`)
                      }
                      className="text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded transition"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
