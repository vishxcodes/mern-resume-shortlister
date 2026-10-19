import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import { FileTextIcon, BriefcaseIcon, SparklesIcon, ArrowRightIcon, CheckCircle2Icon, AlertCircleIcon } from "lucide-react";

export default function CandidateOverview() {
  const [resume, setResume] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resumeRes = await API.get("/resumes/me");
        setResume(resumeRes.data.resume);
      } catch {
        setResume(null);
      }

      try {
        const jobsRes = await API.get("/jobs");
        setJobs(jobsRes.data);
      } catch {
        setJobs([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Candidate Dashboard
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Track your resume readiness, explore open job postings, and review applications.
        </p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Resume Status */}
        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Resume Status</span>
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                resume
                  ? "bg-emerald-950/40 text-emerald-400 border border-emerald-800/40"
                  : "bg-amber-950/40 text-amber-400 border border-amber-800/40"
              }`}
            >
              {resume ? <CheckCircle2Icon className="w-4 h-4" /> : <AlertCircleIcon className="w-4 h-4" />}
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              {resume ? "Uploaded & Active" : "Pending Upload"}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">
              {resume ? "Ready for job matching" : "Upload to apply"}
            </span>
            <Link
              to="/candidate/resume"
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 transition"
            >
              <span>{resume ? "Manage" : "Upload"}</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Available Jobs */}
        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Available Positions</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <BriefcaseIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              {jobs.length} Opportunities
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">Open listings</span>
            <Link
              to="/candidate/jobs"
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 transition"
            >
              <span>Browse</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>

        {/* Matching Readiness */}
        <div className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition group">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-zinc-400">Matching Readiness</span>
            <div className="w-8 h-8 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-300">
              <SparklesIcon className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-4 flex items-baseline gap-2">
            <span className="text-xl font-bold text-white tracking-tight">
              {resume ? "Profile Complete" : "Needs Resume"}
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-zinc-800/60 flex items-center justify-between">
            <span className="text-[11px] text-zinc-500 font-mono">
              {resume ? "TF-IDF active" : "0% vector strength"}
            </span>
            <Link
              to="/candidate/applications"
              className="text-xs text-zinc-300 hover:text-white flex items-center gap-1 transition"
            >
              <span>Applications</span>
              <ArrowRightIcon className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
