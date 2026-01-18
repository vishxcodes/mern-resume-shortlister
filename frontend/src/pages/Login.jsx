import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await API.post("/users/login", form);
      login(data);
      toast.success(`Welcome back, ${data.user.name}!`);

      if (data.user.role === "recruiter") {
        navigate("/recruiter");
      } else {
        navigate("/candidate");
      }
    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Login">
      <div className="max-w-md mx-auto mt-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-lg">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Please sign in to your account
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 px-4 py-3 text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-lg border border-gray-300 dark:border-gray-700 
                bg-white dark:bg-gray-900 px-4 py-3 text-gray-800 dark:text-gray-100
                focus:ring-2 focus:ring-blue-500 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white
              hover:bg-blue-700 transition disabled:opacity-60"
            >
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 dark:text-gray-400 mt-6">
            Don’t have an account?{" "}
            <Link
              to="/register"
              className="text-blue-600 hover:underline"
            >
              Create one
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
