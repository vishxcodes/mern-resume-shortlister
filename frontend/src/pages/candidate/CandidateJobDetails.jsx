import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  BriefcaseIcon,
  MapPinIcon,
  ArrowLeftIcon,
  CalendarIcon,
  CheckCircle2Icon,
  Loader2Icon,
  SparklesIcon,
} from "lucide-react";

export default function CandidateJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  const handleApply = async () => {
    try {
      setApplying(true);
      const { data } = await API.post(`/applications/apply/${id}`);
      toast.success(data.message || "Applied successfully!");
      navigate("/candidate/applications");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error applying for job");
    } finally {
      setApplying(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center gap-2 text-xs text-zinc-500 py-16 justify-center">
        <Loader2Icon className="w-4 h-4 animate-spin text-zinc-400" />
        <span>Loading job position details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="p-12 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/80 max-w-lg mx-auto">
        <p className="text-xs text-zinc-400">Position was not found or is no longer accepting submissions.</p>
        <button
          onClick={() => navigate("/candidate/jobs")}
          className="mt-4 text-xs font-medium text-white hover:underline"
        >
          ← Return to job listings
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition"
      >
        <ArrowLeftIcon className="w-3.5 h-3.5" />
        <span>Back to listings</span>
      </button>

      <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-xl p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 bg-zinc-950 px-2 py-0.5 rounded border border-zinc-800">
              {job.role || "General Position"}
            </span>
            <h1 className="text-2xl font-bold tracking-tight text-white mt-2">
              {job.title}
            </h1>
            <p className="text-xs text-zinc-400 mt-1">
              Posted by {job.recruiterId?.name || "Verified Organization"} {job.recruiterId?.email ? `(${job.recruiterId.email})` : ""}
            </p>
          </div>

          <button
            onClick={handleApply}
            disabled={applying}
            className="inline-flex items-center justify-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50 self-start sm:self-auto"
          >
            {applying ? (
              <>
                <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting...</span>
              </>
            ) : (
              <>
                <SparklesIcon className="w-3.5 h-3.5" />
                <span>Apply with Resume</span>
              </>
            )}
          </button>
        </div>

        {/* Metadata Tags */}
        <div className="flex flex-wrap gap-2 text-xs pt-4 border-t border-zinc-800/80">
          <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md">
            Type: {job.type}
          </span>
          <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded-md">
            Experience: {job.experienceLevel}
          </span>
          <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded-md flex items-center gap-1">
            <MapPinIcon className="w-3 h-3 text-zinc-500" /> {job.location}
          </span>
          <span className="px-2.5 py-1 bg-zinc-950 border border-zinc-800 text-zinc-500 rounded-md flex items-center gap-1 font-mono text-[11px]">
            <CalendarIcon className="w-3 h-3 text-zinc-500" />
            {new Date(job.createdAt).toLocaleDateString()}
          </span>
        </div>

        {/* Full Description */}
        <div className="pt-4 border-t border-zinc-800/80 space-y-3">
          <h2 className="text-xs font-mono uppercase tracking-wider text-zinc-400">
            About the Role & Technical Requirements
          </h2>
          <div className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line bg-zinc-950/60 p-5 rounded-lg border border-zinc-800/60">
            {job.description}
          </div>
        </div>

        {/* Bottom Apply CTA */}
        <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-between">
          <p className="text-[11px] text-zinc-500">
            Your uploaded active resume will be submitted automatically.
          </p>
          <button
            onClick={handleApply}
            disabled={applying}
            className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2.5 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
          >
            {applying ? "Submitting Application..." : "Submit Application"}
          </button>
        </div>
      </div>
    </div>
  );
}
