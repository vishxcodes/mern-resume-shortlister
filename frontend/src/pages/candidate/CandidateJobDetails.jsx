import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { BriefcaseIcon, BuildingIcon, MapPinIcon, ArrowLeftIcon } from "lucide-react";

export default function CandidateJobDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);

  // Fetch job details
  useEffect(() => {
    const fetchJob = async () => {
      try {
        const { data } = await API.get(`/jobs/${id}`);
        setJob(data);
      } catch (err) {
        console.error("Error fetching job:", err);
        toast.error("Error fetching job details");
      } finally {
        setLoading(false);
      }
    };
    fetchJob();
  }, [id]);

  // Handle Apply button
  const handleApply = async () => {
    try {
      setApplying(true);
      const { data } = await API.post(`/applications/apply/${id}`);
      toast.success(data.message || "Applied successfully!");
      navigate("/candidate/jobs");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error applying for job");
    } finally {
      setApplying(false);
    }
  };

  if (loading)
    return <p className="text-gray-500 dark:text-gray-400 mt-10">Loading job details...</p>;

  if (!job)
    return (
      <div className="text-gray-500 dark:text-gray-400 mt-10">
        <p>Job not found or removed.</p>
        <button
          onClick={() => navigate(-1)}
          className="mt-4 text-blue-600 dark:text-blue-400 underline"
        >
          ← Go Back
        </button>
      </div>
    );

  return (
    <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors duration-300">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-blue-600 dark:text-blue-400 mb-4 hover:underline"
      >
        <ArrowLeftIcon className="w-4 h-4" /> Back to Jobs
      </button>

      <div className="flex items-center gap-3 mb-3">
        <BriefcaseIcon className="w-7 h-7 text-blue-600 dark:text-blue-400" />
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {job.title}
        </h1>
      </div>

      <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">
        {job.description}
      </p>

      <div className="text-gray-600 dark:text-gray-400 space-y-1 mb-8">
        <p className="flex items-center gap-2">
          <BuildingIcon className="w-4 h-4" />
          <span>{job.recruiterId?.name || "Anonymous Recruiter"}</span>
        </p>

        {job.location && (
          <p className="flex items-center gap-2">
            <MapPinIcon className="w-4 h-4" />
            <span>{job.location}</span>
          </p>
        )}

        <p>
          <strong>Role:</strong> {job.role || "N/A"} | <strong>Type:</strong>{" "}
          {job.type || "N/A"} | <strong>Experience:</strong>{" "}
          {job.experienceLevel || "N/A"}
        </p>
      </div>

      <button
        onClick={handleApply}
        disabled={applying}
        className={`bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-all ${
          applying ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {applying ? "Applying..." : "Apply Now"}
      </button>
    </div>
  );
}
