import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import { Loader2Icon, BriefcaseIcon, SparklesIcon, ArrowRightIcon } from "lucide-react";

export default function RecruiterRankJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data);
      } catch (err) {
        console.error("Error fetching recruiter jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          AI Candidate Ranking
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Select a job position to run TF-IDF vectorization and cosine similarity against applicant resumes.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-12 justify-center">
          <Loader2Icon className="animate-spin w-4 h-4 text-zinc-400" />
          <span>Loading positions...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <BriefcaseIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-200">No jobs to rank</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            You need at least one active job posting with applicants to perform AI resume ranking.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {job.title}
                  </h3>
                  <span className="text-[11px] font-mono text-zinc-500">
                    {job.role || "General"}
                  </span>
                </div>
                <p className="text-zinc-400 text-xs mb-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>
              </div>

              <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">
                  {job.type} • {job.experienceLevel}
                </span>
                <Link
                  to={`/recruiter/rank-applicants/${job._id}`}
                  className="inline-flex items-center gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  <SparklesIcon className="w-3.5 h-3.5 text-zinc-950" />
                  <span>Rank Resumes</span>
                  <ArrowRightIcon className="w-3.5 h-3.5 text-zinc-950" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
