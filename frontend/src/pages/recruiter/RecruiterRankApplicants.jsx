// RecruiterRankApplicants.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

export default function RecruiterRankApplicants() {
  const { jobId } = useParams(); // ✅ GET jobId FROM URL

  const [applicants, setApplicants] = useState([]);
  const [skipped, setSkipped] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    if (!jobId) {
      console.warn("RecruiterRankApplicants: jobId is undefined, skipping fetch");
      return;
    }
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setErrorMsg(null);
    setMessage(null);

    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `/api/applications/rank/${jobId}`,
        {
          headers: token ? { Authorization: `Bearer ${token}` } : undefined,
        }
      );

      console.log("Rank API response:", res.data);

      const data = res.data;

      setApplicants(Array.isArray(data.applicants) ? data.applicants : []);
      setSkipped(Array.isArray(data.skipped) ? data.skipped : []);
      setMessage(data.message || null);

    } catch (err) {
      console.error("Error fetching applicants:", err);

      if (err.response?.data) {
        setMessage(err.response.data.message || err.response.data.error);
        setSkipped(err.response.data.skipped || []);
      } else {
        setMessage("Network error — could not reach server");
      }

      setApplicants([]);
      setErrorMsg("Failed to fetch applicants");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Ranked Applicants</h2>

      {loading && <p>Loading applicants...</p>}
      {errorMsg && <p className="text-red-600">{errorMsg}</p>}
      {message && <p className="text-yellow-700">{message}</p>}

      {skipped.length > 0 && (
        <div className="mb-3 text-sm text-gray-600">
          Skipped applications (missing resume text): {skipped.join(", ")}
        </div>
      )}

      {applicants.length === 0 && !loading ? (
        <p>No applicants to display.</p>
      ) : (
        <table className="min-w-full text-left">
          <thead>
            <tr>
              <th>Candidate</th>
              <th>Email</th>
              <th>Match Score</th>
              <th>Applied At</th>
            </tr>
          </thead>
          <tbody>
            {applicants.map(app => (
              <tr key={app._id}>
                <td>{app.candidateId?.name || "Unknown"}</td>
                <td>{app.candidateId?.email || "—"}</td>
                <td>{app.matchScoreDisplay}</td>
                <td>{new Date(app.createdAt).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
