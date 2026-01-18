import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";

export default function ActiveJobsTable() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/recruiter/active-jobs");
        setJobs(data);
      } catch (err) {
        console.error("Failed to fetch active jobs", err);
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  if (loading) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        Loading active jobs...
      </div>
    );
  }

  if (jobs.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow">
        No active jobs found.
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-6">
      <h2 className="text-lg font-semibold mb-4">Active Jobs</h2>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="border-b dark:border-gray-700 text-left">
            <tr>
              <th className="pb-2">Job Title</th>
              <th className="pb-2">Applicants</th>
              <th className="pb-2">Shortlisted</th>
              <th className="pb-2">Status</th>
              <th className="pb-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map(job => (
              <tr
                key={job._id}
                className="border-b dark:border-gray-700 last:border-none"
              >
                <td className="py-3 font-medium">{job.title}</td>
                <td>{job.totalApplicants}</td>
                <td>{job.shortlisted}</td>
                <td>
                  <span className="text-green-600 font-medium">Open</span>
                </td>
                <td>
                  <button
                    onClick={() =>
                      navigate(`/recruiter/applicants?jobId=${job._id}`)
                    }
                    className="text-blue-600 hover:underline"
                  >
                    View
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
