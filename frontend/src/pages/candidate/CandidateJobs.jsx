import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  SearchIcon,
  RotateCcwIcon,
  MapPinIcon,
  SparklesIcon,
  ArrowRightIcon,
  Loader2Icon,
} from "lucide-react";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [role, setRole] = useState("");
  const [type, setType] = useState("");
  const [experienceLevel, setExperienceLevel] = useState("");
  const [loading, setLoading] = useState(true);
  const [recommendedJobs, setRecommendedJobs] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(true);

  // Fetch recommended jobs on mount
  useEffect(() => {
    const fetchRecommended = async () => {
      try {
        const { data } = await API.get("/jobs/recommended");
        setRecommendedJobs(Array.isArray(data) ? data : []);
      } catch (err) {
        // quiet fallback if candidate doesn't have resume yet
        setRecommendedJobs([]);
      } finally {
        setLoadingRecommendations(false);
      }
    };
    fetchRecommended();
  }, []);

  // Fetch jobs based on filters/search
  useEffect(() => {
    const fetchJobs = async () => {
      setLoading(true);
      try {
        const { data } = await API.get("/jobs", {
          params: { search, role, type, experienceLevel },
        });
        setJobs(Array.isArray(data) ? data : []);
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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Explore Positions
        </h1>
        <p className="text-xs text-zinc-400 mt-1">
          Discover opportunities that match your technical background and experience.
        </p>
      </div>

      {/* Recommended Jobs Banner (if candidate has a resume) */}
      {!loadingRecommendations && recommendedJobs.length > 0 && (
        <div className="p-5 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
          <div className="flex items-center gap-2">
            <SparklesIcon className="w-4 h-4 text-emerald-400" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-zinc-300">
              Recommended for your resume
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {recommendedJobs.slice(0, 3).map((job) => (
              <Link
                key={job._id}
                to={`/candidate/jobs/${job._id}`}
                className="p-3.5 rounded-lg bg-zinc-950/70 border border-zinc-800 hover:border-zinc-700 transition flex flex-col justify-between"
              >
                <div>
                  <h3 className="text-xs font-semibold text-white truncate">{job.title}</h3>
                  <p className="text-[11px] text-zinc-500 mt-0.5 line-clamp-1">{job.description}</p>
                </div>
                <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span>{job.location}</span>
                  <span className="text-emerald-400 flex items-center gap-0.5">
                    View <ArrowRightIcon className="w-3 h-3" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800/80 space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
          {/* Keyword Search */}
          <div className="sm:col-span-2 relative">
            <SearchIcon className="w-3.5 h-3.5 absolute left-3 top-3 text-zinc-500" />
            <input
              type="text"
              placeholder="Search by title, skill, or keyword..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 outline-none transition"
            />
          </div>

          {/* Workplace Type */}
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-100 focus:border-zinc-500 outline-none transition"
          >
            <option value="">All Types (Remote/On-site)</option>
            <option value="Remote">Remote</option>
            <option value="On-site">On-site</option>
            <option value="Hybrid">Hybrid</option>
          </select>

          {/* Experience */}
          <select
            value={experienceLevel}
            onChange={(e) => setExperienceLevel(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-zinc-800 bg-zinc-950 text-xs text-zinc-100 focus:border-zinc-500 outline-none transition"
          >
            <option value="">All Experience Levels</option>
            <option value="Internship">Internship</option>
            <option value="Fresher">Fresher / Entry</option>
            <option value="Junior">Junior</option>
            <option value="Mid">Mid-Level</option>
            <option value="Senior">Senior</option>
          </select>
        </div>

        {(search || role || type || experienceLevel) && (
          <div className="flex justify-end pt-1">
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1 text-[11px] text-zinc-400 hover:text-white transition"
            >
              <RotateCcwIcon className="w-3 h-3" />
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </div>

      {/* Jobs Grid */}
      {loading ? (
        <div className="flex items-center gap-2 text-xs text-zinc-500 py-12 justify-center">
          <Loader2Icon className="animate-spin w-4 h-4 text-zinc-400" />
          <span>Loading opportunities...</span>
        </div>
      ) : jobs.length === 0 ? (
        <div className="p-12 text-center rounded-xl bg-zinc-900/40 border border-zinc-800/80">
          <BriefcaseIcon className="w-10 h-10 text-zinc-700 mx-auto mb-3" />
          <h3 className="text-sm font-semibold text-zinc-200">No positions matched your query</h3>
          <p className="text-xs text-zinc-500 mt-1">
            Try adjusting your search terms or clearing the applied filters.
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
                  <h3 className="text-base font-semibold text-white tracking-tight">
                    {job.title}
                  </h3>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-zinc-800 text-zinc-300 border border-zinc-700">
                    {job.role || "General"}
                  </span>
                </div>

                <p className="text-zinc-400 text-xs mb-4 line-clamp-3 leading-relaxed">
                  {job.description}
                </p>

                <div className="flex flex-wrap gap-1.5 text-[11px] mb-4">
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

              <div className="pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                <span className="text-[11px] font-mono text-zinc-500">
                  {job.recruiterId?.name ? `Posted by ${job.recruiterId.name}` : "Verified Listing"}
                </span>

                <Link
                  to={`/candidate/jobs/${job._id}`}
                  className="inline-flex items-center gap-1.5 bg-white text-zinc-950 hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition shadow-sm"
                >
                  <span>View & Apply</span>
                  <ArrowRightIcon className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
