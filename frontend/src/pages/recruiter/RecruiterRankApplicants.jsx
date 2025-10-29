import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { MailIcon, FileTextIcon } from "lucide-react";

function RecruiterRankApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  // ✅ Fetch ranked applicants
  useEffect(() => {
    const fetchApplicants = async () => {
      try {
        const { data } = await API.get(`/applications/rank/${jobId}`);
        setApplicants(data);
      } catch (err) {
        console.error("Error fetching applicants:", err);
        toast.error("Failed to load applicants");
      } finally {
        setLoading(false);
      }
    };

    fetchApplicants();
  }, [jobId]);

  // ✅ Handle status update
  const handleStatusChange = async (appId, newStatus) => {
    setUpdatingId(appId);
    try {
      await API.patch(`/applications/${appId}/status`, { status: newStatus });
      toast.success("Status updated successfully!");
      setApplicants((prev) =>
        prev.map((a) =>
          a._id === appId ? { ...a, status: newStatus } : a
        )
      );
    } catch (err) {
      console.error("Error updating status:", err);
      toast.error("Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center mt-10">
        <span className="text-blue-500 font-medium">Loading applicants...</span>
      </div>
    );

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-blue-700 dark:text-blue-400 mb-4">
        Ranked Applicants
      </h1>

      {applicants.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No applicants found for this job.
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {applicants.map((app, index) => {
            // Parse match score safely
            const score = parseFloat(app.matchScore) || 0;
            const percentage = Math.min(score * 100, 100);

            // Determine color based on match score
            const getColor = () => {
              if (score >= 0.7) return "bg-green-500";
              if (score >= 0.4) return "bg-yellow-500";
              return "bg-red-500";
            };

            return (
              <div
                key={app._id}
                className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-200 dark:border-gray-700 transition-colors duration-300"
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                      #{index + 1} •{" "}
                      {app.candidateId?.name || "Unknown Candidate"}
                    </h3>
                  </div>

                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                    Match Score:{" "}
                    <span
                      className={`${
                        score >= 0.7
                          ? "text-green-600 dark:text-green-400"
                          : score >= 0.4
                          ? "text-yellow-500 dark:text-yellow-400"
                          : "text-red-600 dark:text-red-400"
                      }`}
                    >
                      {app.matchScore}
                    </span>
                  </span>
                </div>

                {/* Visual Match Bar */}
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 mb-4 overflow-hidden">
                  <div
                    className={`${getColor()} h-3 transition-all duration-500 ease-in-out`}
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>

                {/* Email */}
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-2 flex items-center gap-2">
                  <MailIcon className="w-4 h-4" />{" "}
                  {app.candidateId?.email || "N/A"}
                </p>

                {/* Resume link */}
                {app.resumeId?.fileUrl && (
                  <a
                    href={`http://localhost:8000/${app.resumeId.fileUrl}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 dark:text-blue-400 flex items-center gap-2 text-sm hover:underline mb-3"
                  >
                    <FileTextIcon className="w-4 h-4" /> View Resume
                  </a>
                )}

                {/* Status Control */}
                <div className="flex items-center justify-between mt-4">
                  <span className="capitalize text-gray-700 dark:text-gray-300">
                    Current Status:{" "}
                    <span className="font-medium text-blue-600 dark:text-blue-400">
                      {app.status}
                    </span>
                  </span>

                  <select
                    disabled={updatingId === app._id}
                    value={app.status}
                    onChange={(e) =>
                      handleStatusChange(app._id, e.target.value)
                    }
                    className="p-2 text-sm rounded-md border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-100 focus:ring-2 focus:ring-blue-500 outline-none"
                  >
                    <option value="applied">Applied</option>
                    <option value="shortlisted">Shortlisted</option>
                    <option value="rejected">Rejected</option>
                    <option value="accepted">Accepted</option>
                  </select>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default RecruiterRankApplicants;
