import { useEffect, useState } from "react";
import API from "../../api/axiosInstance";
import { Link } from "react-router-dom";
import {
  BriefcaseIcon,
  MapPinIcon,
  CalendarIcon,
  Loader2Icon,
} from "lucide-react";

export default function RecruiterJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
          My Posted Jobs
        </h1>
        <Link
          to="/recruiter/post-job"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md transition-all"
        >
          + Post New Job
        </Link>
      </div>

      {loading ? (
        <div className="flex justify-center mt-10">
          <Loader2Icon className="animate-spin w-8 h-8 text-blue-500" />
        </div>
      ) : jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          You haven’t posted any jobs yet.
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

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-3 line-clamp-3">
                {job.description}
              </p>

              <div className="flex flex-wrap gap-2 text-xs mb-3">
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
                  <span className="px-2 py-1 bg-gray-100 dark:bg-gray-900 text-gray-700 dark:text-gray-300 rounded-full flex items-center gap-1">
                    <MapPinIcon className="w-3 h-3" /> {job.location}
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <CalendarIcon className="w-4 h-4" />
                  <span>
                    Posted on{" "}
                    {new Date(job.createdAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                    })}
                  </span>
                </div>

                <Link
                  to={`/recruiter/applicants?jobId=${job._id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline"
                >
                  View Applicants →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
