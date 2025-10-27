import React, { useState } from "react";
import axios from "axios";

const PostJob = () => {
  const [formData, setFormData] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);
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
      setFormData({ title: "", description: "" });
    } catch (error) {
      console.error(error);
      alert("Error posting job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-gray-800 mb-4">
        Post a New Job
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          placeholder="Job Title"
          value={formData.title}
          onChange={(e) =>
            setFormData({ ...formData, title: e.target.value })
          }
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <textarea
          placeholder="Job Description"
          value={formData.description}
          onChange={(e) =>
            setFormData({ ...formData, description: e.target.value })
          }
          rows={4}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-blue-500 outline-none"
          required
        />
        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          {loading ? "Posting..." : "Post Job"}
        </button>
      </form>
    </div>
  );
};

export default PostJob;
