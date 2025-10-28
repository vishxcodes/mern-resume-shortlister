import React, { useState } from "react";
import { toast } from "react-toastify";
import API from "../../api/axiosInstance";
import RecruiterLayout from "../../components/recruiter/RecruiterLayout";

export default function CreateJobPage() {
  const [form, setForm] = useState({ title: "", description: "" });
  const [loading, setLoading] = useState(false);

  const user = JSON.parse(localStorage.getItem("user"));

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.title.trim() || !form.description.trim()) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);

    try {
      const { data } = await API.post("/jobs", {
        recruiterId: user._id,
        title: form.title,
        description: form.description,
      });

      toast.success("✅ Job posted successfully!");
      setForm({ title: "", description: "" });
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.error || "❌ Failed to post job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <RecruiterLayout>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-semibold text-gray-800 dark:text-gray-100 mb-8">
          Post a New Job
        </h1>

        <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow border border-gray-100 dark:border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Job Title */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Job Title
              </label>
              <input
                type="text"
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="e.g. React Developer"
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              />
            </div>

            {/* Job Description */}
            <div>
              <label className="block text-gray-700 dark:text-gray-300 font-medium mb-2">
                Job Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows="6"
                placeholder="Write about job responsibilities, skills required, etc..."
                className="w-full border border-gray-300 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none transition"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full text-white py-3 rounded-lg font-medium transition ${
                loading
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Posting..." : "Post Job"}
            </button>
          </form>
        </div>
      </div>
    </RecruiterLayout>
  );
}
