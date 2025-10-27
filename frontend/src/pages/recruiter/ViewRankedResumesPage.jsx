import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const ViewRankedResumesPage = () => {
  const { jobId } = useParams();
  const [rankedResumes, setRankedResumes] = useState([]);

  useEffect(() => {
    const fetchRanked = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:8000/api/jobs/rank/${jobId}`
        );
        setRankedResumes(data.rankedResumes);
      } catch (err) {
        console.error(err);
      }
    };
    fetchRanked();
  }, [jobId]);

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <h2 className="text-2xl font-semibold mb-6 text-gray-800">
        Ranked Resumes
      </h2>

      {rankedResumes.length === 0 ? (
        <p className="text-gray-600">No resumes available for ranking.</p>
      ) : (
        <table className="w-full bg-white shadow rounded-lg overflow-hidden">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="p-3 text-left">Rank</th>
              <th className="p-3 text-left">Resume ID</th>
              <th className="p-3 text-left">TF-IDF Score</th>
            </tr>
          </thead>
          <tbody>
            {rankedResumes.map((resume, index) => (
              <tr
                key={resume.id}
                className="border-b hover:bg-gray-100 transition"
              >
                <td className="p-3">{index + 1}</td>
                <td className="p-3">{resume.id}</td>
                <td className="p-3 font-medium text-gray-700">
                  {resume.score.toFixed(3)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ViewRankedResumesPage;
