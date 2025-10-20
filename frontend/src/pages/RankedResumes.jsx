import { useEffect, useState } from "react";
import API from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function RankedResumes() {
  const [jobs, setJobs] = useState([]);
  const [ranked, setRanked] = useState(null);

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const { data } = await API.get("/jobs");
        setJobs(data);
      } catch (err) {
        console.error("Error fetching jobs:", err);
      }
    };
    fetchJobs();
  }, []);

  const handleRank = async (jobId) => {
    try {
      const { data } = await API.get(`/jobs/rank/${jobId}`);
      setRanked(data.rankedResumes);
      toast.success("Ranked resumes fetched!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Error ranking resumes");
    }
  };

  return (
    <div className="mt-6">
      <h2 className="text-lg font-semibold mb-2">Ranked Resumes</h2>
      {jobs.map((job) => (
        <div key={job._id} className="border p-2 mb-2 flex justify-between bg-white shadow-sm rounded">
          <span>{job.title}</span>
          <button
            onClick={() => handleRank(job._id)}
            className="bg-gray-800 text-white px-2 py-1 rounded"
          >
            Rank
          </button>
        </div>
      ))}
      {ranked && (
        <div className="mt-4">
          <h3 className="font-bold mb-2">Ranking Results</h3>
          <ul>
            {ranked.map((r, i) => (
              <li key={r.id} className="text-gray-700">
                {i + 1}. Resume {r.id} — Score: {r.score.toFixed(3)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
