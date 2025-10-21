import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { BriefcaseIcon, BuildingIcon, SearchIcon, RotateCcwIcon } from "lucide-react";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(true);

  // 🔍 Fetch jobs based on filters/search
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/jobs", {
          params: { search, role, type, experienceLevel },
        });
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJobs();
  }, [search, role, type, experienceLevel]);

  const handleReset = () => {
    setSearch("");
    setRole("");
    setType("");
    setExperienceLevel("");
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
        Available Jobs
      </h1>

      {/* 🔎 Filter Section */}
      <div className="flex flex-wrap items-center gap-3 bg-white dark:bg-gray-800 p-4 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-colors duration-300">
        {/* Search */}
        <div className="relative flex-1 min-w-[220px]">
          <SearchIcon className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by role, company or skill..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 rounded-md focus:ring-2 focus:ring-blue-500 outline-none transition-colors"
          />
        </div>

        {/* Role Filter */}
        <select
          value={role}
          onChange={(e) => setRole(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Roles</option>
          <option>Frontend</option>
          <option>Backend</option>
          <option>Full Stack</option>
          <option>Data Science</option>
          <option>Marketing</option>
        </select>

        {/* Type Filter */}
        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Types</option>
          <option>Remote</option>
          <option>On-site</option>
          <option>Hybrid</option>
        </select>

        {/* Experience Level Filter */}
        <select
          value={experienceLevel}
          onChange={(e) => setExperienceLevel(e.target.value)}
          className="border border-gray-300 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 p-2 rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        >
          <option value="">All Experience Levels</option>
          <option>Internship</option>
          <option>Fresher</option>
          <option>Junior</option>
          <option>Mid</option>
          <option>Senior</option>
        </select>

        {/* Reset */}
        <button
          onClick={handleReset}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          <RotateCcwIcon className="w-4 h-4" />
          Reset
        </button>
      </div>

      {/* 🧠 Job Results */}
      {loading ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          Loading jobs...
        </p>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400 text-center mt-10">
          No jobs found.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {job.title}
                </h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-3">
                {job.description}
              </p>

              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2 mb-1">
                <BuildingIcon className="w-4 h-4" />
                {job.recruiterId?.name || "Anonymous Recruiter"}
              </p>

              <div className="flex flex-wrap gap-2 mt-3 text-xs">
                {job.role && (
                  <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-full">
                    {job.role}
                  </span>
                )}
                {job.type && (
                  <span className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded-full">
                    {job.type}
                  </span>
                )}
                {job.experienceLevel && (
                  <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 rounded-full">
                    {job.experienceLevel}
                  </span>
                )}
                {job.location && (
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full">
                    {job.location}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
