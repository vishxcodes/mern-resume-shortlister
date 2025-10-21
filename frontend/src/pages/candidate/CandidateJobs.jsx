import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { BriefcaseIcon, BuildingIcon, SearchIcon } from "lucide-react";

export default function CandidateJobs() {
  const [jobs, setJobs] = useState([]);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data);
      } catch {
        setJobs([]);
      }
    };
    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(query.toLowerCase()) ||
      job.description.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700">Available Jobs</h1>
      <div className="relative">
        <SearchIcon className="absolute top-3 left-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search jobs..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-full focus:ring-2 focus:ring-blue-400 outline-none"
        />
      </div>

      {filteredJobs.length === 0 ? (
        <p className="text-gray-500">No jobs found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredJobs.map((job) => (
            <div
  key={job._id}
  className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
>

              <div className="flex items-center gap-3 mb-3">
                <BriefcaseIcon className="w-6 h-6 text-blue-600" />
                <h3 className="text-xl font-semibold">{job.title}</h3>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2 line-clamp-3">
                {job.description}
              </p>
              <p className="text-gray-500 dark:text-gray-400 text-sm flex items-center gap-2">

                <BuildingIcon className="w-4 h-4" />
                {job.recruiterId?.name || "Anonymous Recruiter"}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
