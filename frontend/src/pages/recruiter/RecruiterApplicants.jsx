import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  MailIcon,
  FileTextIcon,
  Loader2Icon,
  CheckCircle2Icon,
  XCircleIcon,
  ClockIcon,
  UsersIcon,
  BriefcaseIcon,
} from "lucide-react";

export default function RecruiterApplicants() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      setLoading(true);
      try {
        let response;
        if (jobId) {
          response = await API.get(`/applications/job/${jobId}`);
        } else {
          response = await API.get(`/applications/recruiter`);
        }
        setApplicants(Array.isArray(response.data) ? response.data : []);
      } catch (err) {
        toast.error("Error fetching applicants");
        console.error("Error fetching applicants:", err);
        setApplicants([]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    try {
      setUpdatingId(appId);
      const { data } = await API.patch(`/applications/${appId}/status`, { status: newStatus });
      setApplicants((prev) =>
        prev.map((app) => (app._id === appId ? { ...app, status: newStatus } : app))
      );
      toast.success(data.message || `Application marked as ${newStatus}`);
    } catch (err) {
      toast.error(err.response?.data?.error || "Error updating status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusBadge = (status) => {
    const s = (status || "").toLowerCase();
    switch (s) {
      case "shortlisted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
            <CheckCircle2Icon className="w-3 h-3" /> Shortlisted
          </span>
        );
      case "accepted":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-emerald-950/60 text-emerald-300 border border-emerald-700/50">
            <CheckCircle2Icon className="w-3 h-3" /> Accepted
          </span>
        );
      case "rejected":
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-rose-950/40 text-rose-400 border border-rose-900/40">
            <XCircleIcon className="w-3 h-3" /> Rejected
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-zinc-800 text-zinc-300 border border-zinc-700/60">
            <ClockIcon className="w-3 h-3" /> Applied
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            {jobId ? "Job Applicants" : "All Applicants"}
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            {jobId
              ? "Reviewing submissions for this specific position"
              : "Review, evaluate resumes, and manage hiring candidate progression."}
          </p>
        </div>
        {jobId && (
          <Link
            to="/recruiter/applicants"
            className="text-xs text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-lg transition self-start sm:self-auto"
          >
            ← View All Applicants
          </Link>
        )}
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-12 justify-center">
          <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
          <span>Loading applicants...</span>
        </div>
      ) : applicants.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <UsersIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-200">No applicants yet</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            Candidates who apply to your posted positions will appear here with parsed resume links and qualification statuses.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {applicants.map((app) => {
            const isUpdating = updatingId === app._id;
            const targetUrl = app.resumeId?.resumeUrl || app.resumeId?.fileUrl;
            const finalHref = targetUrl
              ? targetUrl.startsWith("http")
                ? targetUrl
                : `http://localhost:8000/${targetUrl}`
              : null;

            return (
              <div
                key={app._id}
                className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <h3 className="text-sm font-semibold text-white">
                        {app.candidateId?.name || "Unknown Candidate"}
                      </h3>
                      <p className="text-xs text-zinc-500 flex items-center gap-1.5 mt-0.5">
                        <MailIcon className="w-3.5 h-3.5 text-zinc-600" />
                        <span>{app.candidateId?.email || "N/A"}</span>
                      </p>
                    </div>
                    {getStatusBadge(app.status)}
                  </div>

                  {app.jobId?.title && (
                    <div className="my-3 py-1.5 px-2.5 rounded bg-zinc-950/70 border border-zinc-800/60 flex items-center gap-2 text-xs text-zinc-400">
                      <BriefcaseIcon className="w-3.5 h-3.5 text-zinc-500" />
                      <span className="font-medium text-zinc-300">{app.jobId.title}</span>
                      {app.jobId.role && (
                        <span className="text-zinc-600 font-mono">({app.jobId.role})</span>
                      )}
                    </div>
                  )}

                  {finalHref && (
                    <div className="mt-3">
                      <a
                        href={finalHref}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 text-xs text-zinc-300 hover:text-white bg-zinc-800/80 hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-zinc-700/60 transition"
                      >
                        <FileTextIcon className="w-3.5 h-3.5 text-zinc-400" />
                        <span>View Parsed Resume</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Status action buttons */}
                <div className="pt-4 mt-4 border-t border-zinc-800/80 flex items-center justify-between gap-2 text-xs">
                  <span className="text-[11px] text-zinc-500 font-mono">
                    Applied {new Date(app.createdAt).toLocaleDateString()}
                  </span>

                  <div className="flex items-center gap-1.5">
                    {isUpdating ? (
                      <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
                    ) : (
                      <>
                        <button
                          onClick={() => handleStatusChange(app._id, "shortlisted")}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                            app.status === "shortlisted"
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700"
                              : "text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                          }`}
                        >
                          Shortlist
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "accepted")}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                            app.status === "accepted"
                              ? "bg-emerald-950/60 text-emerald-300 border border-emerald-700"
                              : "text-zinc-400 hover:text-zinc-200 bg-zinc-900 border border-zinc-800 hover:bg-zinc-800"
                          }`}
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => handleStatusChange(app._id, "rejected")}
                          className={`px-2 py-1 rounded text-[11px] font-medium transition ${
                            app.status === "rejected"
                              ? "bg-rose-950/60 text-rose-300 border border-rose-900"
                              : "text-zinc-400 hover:text-rose-400 bg-zinc-900 border border-zinc-800 hover:bg-rose-950/20"
                          }`}
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
