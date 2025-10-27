import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../../api/axiosInstance";
import { BriefcaseIcon, ClockIcon, CheckCircleIcon, XCircleIcon } from "lucide-react";

export default function CandidateApplications() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const { data } = await API.get("/applications/my-applications");
        setApplications(data);
      } catch (err) {
        console.error("Error fetching applications:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const getStatusBadge = (status) => {
    const base = "px-3 py-1 rounded-full text-sm font-medium";
    switch (status) {
      case "Applied":
        return (
          <span className={`${base} bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300`}>
            <ClockIcon className="inline w-4 h-4 mr-1" /> Applied
          </span>
        );
      case "Shortlisted":
        return (
          <span className={`${base} bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300`}>
            <CheckCircleIcon className="inline w-4 h-4 mr-1" /> Shortlisted
          </span>
        );
      case "Rejected":
        return (
          <span className={`${base} bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300`}>
            <XCircleIcon className="inline w-4 h-4 mr-1" /> Rejected
          </span>
        );
      default:
        return (
          <span className={`${base} bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300`}>
            Pending
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">My Applications</h1>

      {loading ? (
        <p className="text-gray-500 dark:text-gray-400">Loading applications...</p>
      ) : applications.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">You haven’t applied for any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applications.map((app) => (
            <div
              key={app._id}
              className="p-6 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
            >
              <div className="flex items-center gap-3 mb-3">
                <BriefcaseIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                  {app.jobId?.title || "Unknown Job"}
                </h3>
              </div>

              <p className="text-gray-700 dark:text-gray-300 text-sm mb-2">
                {app.jobId?.role || "N/A"} | {app.jobId?.type || "N/A"} |{" "}
                {app.jobId?.location || "N/A"}
              </p>

              <div className="flex items-center justify-between mt-4">
                {getStatusBadge(app.status)}
                <Link
                  to={`/candidate/jobs/${app.jobId?._id}`}
                  className="text-blue-600 dark:text-blue-400 hover:underline font-medium text-sm"
                >
                  View Job →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
