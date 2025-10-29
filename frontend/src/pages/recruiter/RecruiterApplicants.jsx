import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import {
  UserIcon,
  MailIcon,
  FileTextIcon,
  Loader2Icon,
  CheckCircleIcon,
  XCircleIcon,
  BriefcaseIcon,
} from "lucide-react";

export default function RecruiterApplicants() {
  const [searchParams] = useSearchParams();
  const jobId = searchParams.get("jobId");

  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        let response;
        if (jobId) {
          response = await API.get(`/applications/job/${jobId}`);
        } else {
          response = await API.get(`/applications/recruiter`);
        }
        setApplicants(response.data);
      } catch (err) {
        toast.error("Error fetching applicants");
        console.error("Error fetching applicants:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplicants();
  }, [jobId]);

  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      const { data } = await API.patch(`/applications/${appId}/status`, { status: newStatus });
      toast.success(`Status updated to ${newStatus}`);
      setApplicants((prev) =>
        prev.map((a) => (a._id === appId ? { ...a, status: newStatus } : a))
      );
    } catch (err) {
      toast.error("Error updating status");
      console.error("Error updating applicant status:", err);
    } finally {
      setUpdatingId(null);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "shortlisted":
        return "text-green-600 dark:text-green-400";
      case "rejected":
        return "text-red-600 dark:text-red-400";
      case "accepted":
        return "text-blue-600 dark:text-blue-400";
      default:
        return "text-gray-600 dark:text-gray-400";
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <Loader2Icon className="animate-spin w-8 h-8 text-blue-500" />
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400">
        {jobId ? "Job Applicants" : "All Applicants"}
      </h1>

      {applicants.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No applicants found.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {applicants.map((app) => (
            <div
              key={app._id}
              className="p-6 bg-white dark:bg-gray-800 shadow-lg rounded-xl border border-gray-100 dark:border-gray-700 transition-colors duration-300"
            >
              {/* Job Info */}
              <div className="flex items-center gap-2 mb-3">
                <BriefcaseIcon className="w-5 h-5 text-blue-500" />
                <p className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {app.jobId?.title || "Unknown Job"}
                </p>
              </div>

              {/* Candidate Info */}
              <div className="flex items-center gap-3 mb-2">
                <UserIcon className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                <h3 className="text-xl font-semibold">
                  {app.candidateId?.name || "Unknown Candidate"}
                </h3>
              </div>

              <p className="text-gray-600 dark:text-gray-400 text-sm flex items-center gap-2 mb-2">
                <MailIcon className="w-4 h-4" /> {app.candidateId?.email || "N/A"}
              </p>

              {app.resumeId?.fileUrl && (
                <a
                  href={`http://localhost:8000/${app.resumeId.fileUrl}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-blue-600 dark:text-blue-400 hover:underline text-sm mb-3"
                >
                  <FileTextIcon className="w-4 h-4" /> View Resume
                </a>
              )}

              {/* Status Section */}
              <div className="flex items-center justify-between mt-4">
                <div className={`flex items-center gap-2 text-sm font-medium ${getStatusColor(app.status)}`}>
                  <span className="capitalize">{app.status}</span>
                </div>

                <select
                  disabled={updatingId === app._id}
                  value={app.status}
                  onChange={(e) => handleStatusChange(app._id, e.target.value)}
                  className="p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="applied">Applied</option>
                  <option value="shortlisted">Shortlisted</option>
                  <option value="rejected">Rejected</option>
                  <option value="accepted">Accepted</option>
                </select>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
