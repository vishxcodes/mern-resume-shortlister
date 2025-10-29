import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import { Loader2Icon, BriefcaseIcon } from "lucide-react";

export default function RecruiterRankJobs() {
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

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Loader2Icon className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">Rank Applicants</h1>
      {jobs.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You haven’t posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.map((job) => (
            <div
              key={job._id}
              className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-2">
                <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold">{job.title}</h3>
              </div>
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {job.description}
              </p>
              <Link
                to={`/recruiter/rank-applicants/${job._id}`}
                className="block text-center bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-md transition"
              >
                Rank Applicants
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
