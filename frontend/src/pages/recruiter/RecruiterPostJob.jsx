import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { BriefcaseIcon, MapPinIcon, Loader2Icon } from "lucide-react";

export default function RecruiterPostJob() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    role: "",
    type: "",
    location: "",
    experienceLevel: "",
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
    <div className="max-w-3xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <div className="flex items-center gap-3 mb-6">
        <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Post a New Job
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Job Title */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="e.g. Frontend Developer Intern"
          />
        </div>

        {/* Job Description */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Job Description <span className="text-red-500">*</span>
          </label>
          <textarea
            name="description"
            rows="4"
            value={formData.description}
            onChange={handleChange}
            required
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            placeholder="Describe the responsibilities, required skills, and expectations..."
          ></textarea>
        </div>

        {/* Role */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Role
          </label>
          <input
            type="text"
            name="role"
            value={formData.role}
            onChange={handleChange}
            placeholder="e.g. Frontend / Backend / Data Science"
            className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
          />
        </div>

        {/* Type & Experience */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Job Type
            </label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Type</option>
              <option>Remote</option>
              <option>On-site</option>
              <option>Hybrid</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
              Experience Level
            </label>
            <select
              name="experienceLevel"
              value={formData.experienceLevel}
              onChange={handleChange}
              className="w-full p-3 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            >
              <option value="">Select Level</option>
              <option>Internship</option>
              <option>Fresher</option>
              <option>Junior</option>
              <option>Mid</option>
              <option>Senior</option>
            </select>
          </div>
        </div>

        {/* Location */}
        <div>
          <label className="block font-medium text-gray-700 dark:text-gray-300 mb-1">
            Location
          </label>
          <div className="relative">
            <MapPinIcon className="absolute left-3 top-3 text-gray-400 w-5 h-5" />
            <input
              type="text"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Delhi, Bangalore, Remote"
              className="w-full p-3 pl-10 rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none transition"
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading}
            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all disabled:opacity-70"
          >
            {loading ? (
              <>
                <Loader2Icon className="animate-spin w-5 h-5" /> Posting...
              </>
            ) : (
              "Post Job"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
