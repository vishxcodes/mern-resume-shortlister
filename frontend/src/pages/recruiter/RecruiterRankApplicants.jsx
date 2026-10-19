import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import {
  SparklesIcon,
  Loader2Icon,
  ArrowLeftIcon,
  RotateCcwIcon,
  FileTextIcon,
  CheckCircle2Icon,
  AlertTriangleIcon,
} from "lucide-react";

export default function RecruiterRankApplicants() {
  const { jobId } = useParams();

  const [applicants, setApplicants] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!jobId) {
      console.warn("RecruiterRankApplicants: jobId is undefined");
      return;
    }
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    try {
      const res = await API.get(`/applications/rank/${jobId}`);
      setApplicants(Array.isArray(res.data.applicants) ? res.data.applicants : []);
      setSkipped(Array.isArray(res.data.skipped) ? res.data.skipped : []);
      setMessage(res.data.message || null);
    } catch (err) {
      console.error("Error fetching applicants:", err);
      if (err.response?.data) {
        setMessage(err.response.data.message || err.response.data.error);
        setSkipped(err.response.data.skipped || []);
      } else {
        setMessage("Network error — could not reach server");
      }
      setApplicants([]);
      setErrorMsg("Failed to run resume ranking");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            to="/recruiter/rank-applicants"
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition"
          >
            <ArrowLeftIcon className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white">
                Ranked Candidates
              </h1>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono bg-zinc-800 text-zinc-300 border border-zinc-700">
                <SparklesIcon className="w-3 h-3 text-zinc-400" />
                TF-IDF
              </span>
            </div>
            <p className="text-xs text-zinc-400 mt-0.5">
              Candidates sorted by cosine similarity relevance between resume and job description.
            </p>
          </div>
        </div>

        <button
          onClick={fetchApplicants}
          disabled={loading}
          className="inline-flex items-center gap-1.5 bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white px-3.5 py-1.5 rounded-lg text-xs font-medium transition self-start sm:self-auto disabled:opacity-50"
        >
          <RotateCcwIcon className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          <span>Re-compute</span>
        </button>
      </div>

      {/* Warning/Info Messages */}
      {errorMsg && (
        <div className="p-3.5 rounded-xl bg-rose-950/40 border border-rose-900/50 text-xs text-rose-300 flex items-center gap-2">
          <AlertTriangleIcon className="w-4 h-4 text-rose-400 flex-shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {message && (
        <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-900/40 text-xs text-amber-300 flex items-center gap-2">
          <AlertTriangleIcon className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {skipped.length > 0 && (
        <div className="p-3 rounded-lg bg-zinc-900/40 border border-zinc-800/80 text-[11px] text-zinc-400">
          <span className="font-semibold text-zinc-300">Note:</span> {skipped.length} applicant(s) skipped due to missing or unreadable resume text.
        </div>
      )}

      {/* Main Ranking Table */}
      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center gap-2 text-xs text-zinc-500 py-16 justify-center">
            <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
            <span>Calculating TF-IDF cosine similarities...</span>
          </div>
        ) : applicants.length === 0 ? (
          <div className="p-12 text-center text-xs text-zinc-500">
            <p>No applicants available to rank for this job yet.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-zinc-950/70 border-b border-zinc-800/80 text-[11px] font-mono uppercase tracking-wider text-zinc-500">
                <tr>
                  <th className="py-3 px-4 font-medium w-16">Rank</th>
                  <th className="py-3 px-4 font-medium">Candidate</th>
                  <th className="py-3 px-4 font-medium">Match Score</th>
                  <th className="py-3 px-4 font-medium">Status</th>
                  <th className="py-3 px-4 font-medium">Applied Date</th>
                  <th className="py-3 px-4 font-medium text-right">Resume</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-800/50">
                {applicants.map((app, index) => {
                  const score = app.matchScore || 0;
                  const isTopMatch = index === 0 && score > 0;
                  const targetUrl = app.resumeId?.resumeUrl || app.resumeId?.fileUrl;
                  const finalHref = targetUrl
                    ? targetUrl.startsWith("http")
                      ? targetUrl
                      : `http://localhost:8000/${targetUrl}`
                    : null;

                  return (
                    <tr
                      key={app._id}
                      className={`hover:bg-zinc-900/40 transition ${
                        isTopMatch ? "bg-emerald-950/10" : ""
                      }`}
                    >
                      {/* Rank Index */}
                      <td className="py-3.5 px-4 font-mono font-medium">
                        <span
                          className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs ${
                            index === 0
                              ? "bg-emerald-500 text-zinc-950 font-bold"
                              : index === 1
                              ? "bg-zinc-300 text-zinc-950 font-bold"
                              : index === 2
                              ? "bg-zinc-700 text-white font-medium"
                              : "text-zinc-500"
                          }`}
                        >
                          {index + 1}
                        </span>
                      </td>

                      {/* Candidate Info */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-zinc-200">
                          {app.candidateId?.name || "Unknown"}
                        </div>
                        <div className="text-[11px] text-zinc-500 font-mono">
                          {app.candidateId?.email || "—"}
                        </div>
                      </td>

                      {/* Score Indicator */}
                      <td className="py-3.5 px-4 min-w-[140px]">
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-xs font-semibold text-white">
                            {app.matchScoreDisplay || `${score.toFixed(1)}%`}
                          </span>
                          <div className="flex-1 h-1.5 bg-zinc-800 rounded-full overflow-hidden max-w-[80px]">
                            <div
                              className={`h-full rounded-full ${
                                score >= 50
                                  ? "bg-emerald-400"
                                  : score >= 20
                                  ? "bg-blue-400"
                                  : "bg-zinc-500"
                              }`}
                              style={{ width: `${Math.min(score, 100)}%` }}
                            />
                          </div>
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span className="capitalize text-[11px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700/60">
                          {app.status || "applied"}
                        </span>
                      </td>

                      {/* Applied Date */}
                      <td className="py-3.5 px-4 text-zinc-500 font-mono text-[11px]">
                        {new Date(app.createdAt).toLocaleDateString()}
                      </td>

                      {/* Resume View Action */}
                      <td className="py-3.5 px-4 text-right">
                        {finalHref ? (
                          <a
                            href={finalHref}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-xs text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-2.5 py-1 rounded transition"
                          >
                            <FileTextIcon className="w-3.5 h-3.5 text-zinc-400" />
                            <span>Preview</span>
                          </a>
                        ) : (
                          <span className="text-zinc-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
