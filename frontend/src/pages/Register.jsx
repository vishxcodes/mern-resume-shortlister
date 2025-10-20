import { useState } from "react";
import API from "../api/axiosInstance";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/users/register", form);
      toast.success("Registered successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <Layout title="Candidate Registration">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md space-y-4"
      >
        <input
          type="text"
          placeholder="Full Name"
          className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
        />
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white font-semibold w-full py-3 rounded hover:bg-green-700 transition"
        >
          Register
        </button>
      </form>
    </Layout>
  );
}
