import { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axiosInstance";
import { AuthContext } from "../context/AuthContext";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { SparklesIcon, Loader2Icon } from "lucide-react";

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
    <Layout title="Sign In">
      <div className="bg-zinc-900/80 border border-zinc-800/90 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white mb-3 shadow-inner">
            <SparklesIcon className="w-5 h-5 text-zinc-300" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Welcome back
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Sign in to access your talent workspace
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="name@company.com"
              value={form.email}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none transition"
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={form.password}
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none transition"
              onChange={(e) =>
                setForm({ ...form, password: e.target.value })
              }
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm mt-2"
          >
            {loading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Signing in...</span>
              </>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-400 mt-6">
          Don’t have an account?{" "}
          <Link
            to="/register"
            className="text-white hover:underline font-medium"
          >
            Create one
          </Link>
        </p>
      </div>
    </Layout>
  );
}
