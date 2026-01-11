// RecruiterRankApplicants.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function RecruiterRankApplicants({ jobId }) {
  const [applicants, setApplicants] = useState([]); // ALWAYS an array
  const [skipped, setSkipped] = useState([]); // application IDs skipped by backend
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    fetchApplicants();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [jobId]);

  const fetchApplicants = async () => {
    setLoading(true);
    setErrorMsg(null);
    setMessage(null);
    try {
      const token = localStorage.getItem("token"); // adjust if you store token elsewhere
      const res = await axios.get(`/api/applications/rank/${jobId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      });

      console.log("Rank API response (success):", res.data);

      // Resilience: backend may return different shapes. Normalize to { applicants: [], skipped: [], message }
      const data = res.data;

      // If the backend returns an array directly (old behavior), treat that as applicants array:
      if (Array.isArray(data)) {
        setApplicants(data);
        setSkipped([]);
        setMessage(null);
      } else {
        // If backend returned object, try to pull applicants/skipped/message fields safely
        const safeApplicants = Array.isArray(data.applicants)
          ? data.applicants
          : Array.isArray(data) // fallback if server returned array at top-level
          ? data
          : [];

        setApplicants(safeApplicants);
        setSkipped(Array.isArray(data.skipped) ? data.skipped : []);
        setMessage(data.message || data.error || null);
      }
    } catch (err) {
      console.error("Error fetching applicants:", err);

      // If server returned an error response (400/500) with useful body, use that
      if (err.response && err.response.data) {
        console.log("Server error body:", err.response.data);
        const data = err.response.data;

        // If data contains applicants array despite being error, use it
        if (Array.isArray(data.applicants)) {
          setApplicants(data.applicants);
          setSkipped(Array.isArray(data.skipped) ? data.skipped : []);
          setMessage(data.message || null);
        } else {
          // Otherwise, make sure applicants stays an array and surface message
          setApplicants([]);
          setSkipped(Array.isArray(data.skipped) ? data.skipped : []);
          setMessage(data.message || data.error || "Failed to fetch ranked applicants");
        }
      } else {
        // Network error or no response
        setApplicants([]);
        setSkipped([]);
        setMessage("Network error — could not reach server");
      }
      setErrorMsg("Failed to fetch applicants. See console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-3">Ranked Applicants</h2>

      {loading && <div>Loading applicants...</div>}

      {errorMsg && <div className="text-red-600 mb-2">{errorMsg}</div>}

      {message && (
        <div className="mb-3 p-2 bg-yellow-50 border border-yellow-200 rounded">
          {message}
        </div>
      )}

      {skipped && skipped.length > 0 && (
        <div className="mb-3 p-2 bg-gray-50 border rounded">
          <strong>Skipped applications (missing/empty resumes):</strong>{" "}
          {skipped.slice(0, 10).join(", ")}
          {skipped.length > 10 ? ` ... (+${skipped.length - 10} more)` : ""}
        </div>
      )}

      {/* Safe mapping: applicants is guaranteed to be an array */}
      {applicants.length === 0 && !loading ? (
        <div>No applicants to display.</div>
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
            {applicants.map((app) => {
              // app shape may vary; be defensive
              const candidate = app.candidateId || app.candidate || {};
              const name = candidate.name || (candidate.fullName ? candidate.fullName : "Unknown");
              const email = candidate.email || "—";
              const scoreDisplay =
                app.matchScoreDisplay ?? (typeof app.matchScore === "number" ? app.matchScore.toFixed(3) : "0.000");
              const createdAt = app.createdAt ? new Date(app.createdAt).toLocaleString() : "—";

              return (
                <tr key={app._id || app.id || Math.random()}>
                  <td>{name}</td>
                  <td>{email}</td>
                  <td>{scoreDisplay}</td>
                  <td>{createdAt}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}
