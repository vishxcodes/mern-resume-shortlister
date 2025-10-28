import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await API.post("/users/login", form);
      login(data);

      toast.success(`Welcome back, ${data.user.name}!`);

      // ✅ Redirect based on user role
      if (data.user.role === "recruiter") {
        navigate("/recruiter/dashboard"); // recruiter goes here
      } else if (data.user.role === "candidate") {
        navigate("/candidate"); // candidate dashboard
      } else {
        navigate("/"); // default
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    }
  };

  return (
    <Layout title="Login">
      <form
        onSubmit={handleSubmit}
        className="max-w-md mx-auto bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-md space-y-4"
      >
        <input
          type="email"
          placeholder="Email"
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 dark:text-gray-100"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          placeholder="Password"
          className="border border-gray-300 dark:border-gray-700 dark:bg-gray-900 p-3 w-full rounded focus:ring-2 focus:ring-blue-400 outline-none text-gray-800 dark:text-gray-100"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white font-semibold w-full py-3 rounded hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </Layout>
  );
}
