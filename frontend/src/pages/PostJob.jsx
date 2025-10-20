import { useState, useContext } from "react";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function PostJob() {
  const { user } = useContext(AuthContext);
  const [form, setForm] = useState({ title: "", description: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/jobs", { recruiterId: user._id, ...form });
      toast.success("Job posted successfully!");
      setForm({ title: "", description: "" });
    } catch (err) {
      toast.error(err.response?.data?.error || "Error posting job");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 mb-6 rounded bg-white shadow">
      <h2 className="text-lg font-semibold mb-2">Post a New Job</h2>
      <input
        placeholder="Job Title"
        className="border p-2 w-full mb-3"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        placeholder="Job Description"
        className="border p-2 w-full mb-3"
        rows="4"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      />
      <button className="bg-blue-600 text-white px-3 py-1 rounded">
        Post Job
      </button>
    </form>
  );
}
