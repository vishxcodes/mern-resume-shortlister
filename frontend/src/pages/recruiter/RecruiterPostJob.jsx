import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { BriefcaseIcon, Loader2Icon, ArrowLeftIcon } from "lucide-react";

export default function RecruiterPostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "Full Stack",
    type: "Remote",
    location: "Remote",
    experienceLevel: "Mid",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data } = await API.post("/jobs", formData);
      toast.success(data.message || "Job posted successfully!");
      navigate("/recruiter/jobs");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <button
          onClick={() => navigate(-1)}
          className="p-1.5 rounded-lg text-zinc-400 hover:text-white bg-zinc-900 border border-zinc-800 transition"
        >
          <ArrowLeftIcon className="w-4 h-4" />
        </button>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Post a New Job
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Create a position to receive and rank candidates with TF-IDF similarity.
          </p>
        </div>
      </div>

      <div className="bg-zinc-900/60 border border-zinc-800/80 p-6 sm:p-8 rounded-xl shadow-xl">
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Job Title */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Job Title <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Job Description & Required Skills <span className="text-rose-400">*</span>
            </label>
            <textarea
              name="description"
              rows="5"
              value={formData.description}
              onChange={handleChange}
              required
              placeholder="Provide responsibilities, tech stack, and key skills. This text will be used to calculate TF-IDF similarity scores against applicant resumes..."
              className="w-full p-3 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition leading-relaxed"
            />
            <p className="text-[11px] text-zinc-500 mt-1">
              Tip: Include specific frameworks and keywords for higher ranking accuracy.
            </p>
          </div>

          {/* Role and Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Role Category
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g. Frontend, Backend, ML"
                className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Location
              </label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. San Francisco, CA / Remote"
                className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 placeholder-zinc-500 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
              />
            </div>
          </div>

          {/* Type & Experience */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Workplace Type
              </label>
              <select
                name="type"
                value={formData.type}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
              >
                <option value="Remote">Remote</option>
                <option value="On-site">On-site</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                Experience Level
              </label>
              <select
                name="experienceLevel"
                value={formData.experienceLevel}
                onChange={handleChange}
                className="w-full p-2.5 rounded-lg border border-zinc-800 bg-zinc-950 text-zinc-100 text-xs focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
              >
                <option value="Internship">Internship</option>
                <option value="Fresher">Fresher / Entry</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid-Level</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-zinc-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate("/recruiter/jobs")}
              className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-white transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center gap-2 bg-white text-zinc-950 hover:bg-zinc-200 px-5 py-2 rounded-lg text-xs font-semibold transition shadow-sm disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2Icon className="w-3.5 h-3.5 animate-spin" />
                  <span>Publishing...</span>
                </>
              ) : (
                "Publish Job Opening"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
