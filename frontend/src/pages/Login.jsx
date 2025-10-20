import { useState, useContext } from "react";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", form);
      login(data);
      toast.success("Login successful!");
      window.location.href = "/";
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Layout title="Candidate Login">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-md space-y-4"
      >
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
          className="bg-blue-600 text-white font-semibold w-full py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </Layout>
  );
}
