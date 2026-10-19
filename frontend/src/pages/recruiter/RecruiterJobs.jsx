import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  Loader2Icon,
  Trash2Icon,
  PlusIcon,
  UsersIcon,
} from "lucide-react";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingIds, setDeletingIds] = useState([]);

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

  const handleDelete = async (jobId) => {
    const confirm = window.confirm("Are you sure you want to delete this job posting? This cannot be undone.");
    if (!confirm) return;

    try {
      setDeletingIds((s) => [...s, jobId]);
      await API.delete(`/jobs/${jobId}`);
      setJobs((prev) => prev.filter((j) => j._id !== jobId));
    } catch (err) {
      console.error("Error deleting job:", err);
      alert(err?.response?.data?.error || "Failed to delete job");
    } finally {
      setDeletingIds((s) => s.filter((id) => id !== jobId));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Job Postings
          </h1>
          <p className="text-xs text-zinc-400 mt-1">
            Manage your open listings, inspect incoming applicants, and rank candidates.
          </p>
        </div>
        <Link
          to="/recruiter/post-job"
          className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm self-start sm:self-auto"
        >
          <PlusIcon className="w-4 h-4" />
          <span>Post New Job</span>
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-12 justify-center">
          <Loader2Icon className="animate-spin w-4 h-4 text-zinc-400" />
          <span>Loading job postings...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <BriefcaseIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-200">No active job postings</h3>
          <p className="text-xs text-zinc-500 mt-1 max-w-sm mx-auto">
            You haven't posted any jobs yet. Create your first opening to start collecting and ranking applicant resumes.
          </p>
          <Link
            to="/recruiter/post-job"
            className="mt-4 inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-4 py-2 rounded-lg text-xs font-semibold transition shadow-sm"
          >
            <PlusIcon className="w-3.5 h-3.5" />
            <span>Create First Job</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jobs.map((job) => {
            const isDeleting = deletingIds.includes(job._id);
            return (
              <div
                key={job._id}
                className="p-5 bg-zinc-900/60 border border-zinc-800/80 rounded-xl hover:border-zinc-700/80 transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <h3 className="text-base font-semibold text-white tracking-tight">
                      {job.title}
                    </h3>
                    <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-emerald-950/40 text-emerald-400 border border-emerald-800/40">
                      Active
                    </span>
                  </div>

                  <p className="text-zinc-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                    {job.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 text-[11px] mb-4">
                    {job.role && (
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded">
                        {job.role}
                      </span>
                    )}
                    {job.type && (
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded">
                        {job.type}
                      </span>
                    )}
                    {job.experienceLevel && (
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-300 rounded">
                        {job.experienceLevel}
                      </span>
                    )}
                    {job.location && (
                      <span className="px-2 py-0.5 bg-zinc-950 border border-zinc-800 text-zinc-400 rounded flex items-center gap-1">
                        <MapPinIcon className="w-3 h-3 text-zinc-500" /> {job.location}
                      </span>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between text-xs text-zinc-500">
                  <div className="flex items-center gap-1.5 font-mono text-[11px]">
                    <CalendarIcon className="w-3.5 h-3.5 text-zinc-500" />
                    <span>
                      {new Date(job.createdAt).toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Link
                      to={`/recruiter/applicants?jobId=${job._id}`}
                      className="inline-flex items-center gap-1 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-800 hover:bg-zinc-700 px-3 py-1.5 rounded-lg transition"
                    >
                      <UsersIcon className="w-3.5 h-3.5" />
                      <span>Applicants</span>
                    </Link>

                    <button
                      onClick={() => handleDelete(job._id)}
                      disabled={isDeleting}
                      title="Delete job posting"
                      className="p-1.5 rounded-lg text-zinc-500 hover:text-rose-400 hover:bg-rose-950/30 border border-transparent hover:border-rose-900/40 transition disabled:opacity-50"
                    >
                      {isDeleting ? (
                        <Loader2Icon className="w-4 h-4 animate-spin text-rose-400" />
                      ) : (
                        <Trash2Icon className="w-4 h-4" />
                      )}
                    </button>
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
