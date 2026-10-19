import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import { BriefcaseIcon, ClockIcon, CheckCircle2Icon, XCircleIcon, Loader2Icon, ArrowRightIcon } from "lucide-react";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get("/applications/my-applications");
        setApplications(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "applied":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            <ClockIcon className="w-3 h-3 text-zinc-400" /> Applied
          </span>
        );
      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2Icon className="w-3 h-3 text-emerald-400" /> Shortlisted
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
            <CheckCircle2Icon className="w-3 h-3 text-emerald-300" /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-950/40 text-rose-400 border border-rose-900/40">
            <XCircleIcon className="w-3 h-3 text-rose-400" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            {status || "Pending"}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          My Applications
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Review the status of jobs you have applied for and track recruiter updates.
        </p>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-12 justify-center">
          <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
          <span>Loading applications...</span>
        </div>
      ) : applications.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <BriefcaseIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-200">No applications submitted yet</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Browse available opportunities and apply using your active resume to start tracking submissions here.
          </p>
          <Link
            to="/candidate/jobs"
            className="mt-4 inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <span>Browse Jobs</span>
            <ArrowRightIcon className="w-3.5 h-3.5" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition flex flex-col justify-between"
            >
              <div>
                <div className="flex items-start justify-between gap-3 mb-2">
                  <h3 className="text-sm font-semibold text-white tracking-tight">
                    {app.jobId?.title || "Position Removed"}
                  </h3>
                  {getStatusBadge(app.status)}
                </div>

                <p className="text-xs text-zinc-400 mb-3">
                  {app.jobId?.role || "General"} • {app.jobId?.type || "Remote"} • {app.jobId?.location || "Remote"}
                </p>

                {app.jobId?.description && (
                  <p className="text-xs text-zinc-500 line-clamp-2 leading-relaxed mb-4">
                    {app.jobId.description}
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                <span className="text-[11px] font-mono">
                  Submitted {new Date(app.createdAt).toLocaleDateString()}
                </span>

                {app.jobId?._id ? (
                  <Link
                    to={`/candidate/jobs/${app.jobId._id}`}
                    className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white transition"
                  >
                    <span>View Posting</span>
                    <ArrowRightIcon className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-xs text-zinc-600">Unavailable</span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
