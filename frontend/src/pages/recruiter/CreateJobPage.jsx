import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const CreateJobPage = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("http://localhost:8000/api/jobs", {
        recruiterId: user._id,
        ...formData,
      });
      alert("Job posted successfully!");
      navigate("/recruiter/dashboard");
    } catch (err) {
      console.error(err);
      alert("Error creating job.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-white w-full max-w-lg p-8 rounded-xl shadow"
      >
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">
          Post a New Job
        </h2>

        <div className="mb-4">
          <label className="block text-gray-700 font-medium mb-2">Title</label>
          <input
            type="text"
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            placeholder="Enter job title"
            value={formData.title}
            onChange={(e) =>
              setFormData({ ...formData, title: e.target.value })
            }
            required
          />
        </div>

        <div className="mb-6">
          <label className="block text-gray-700 font-medium mb-2">
            Description
          </label>
          <textarea
            className="w-full border p-2 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            rows="5"
            placeholder="Enter job description"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            required
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default CreateJobPage;
