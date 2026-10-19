import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import API from "../api/axiosInstance";
import { toast } from "react-toastify";
import Layout from "../components/Layout";
import { SparklesIcon, Loader2Icon, EyeIcon, EyeOffIcon } from "lucide-react";

export default function Register() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidate",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // Password strength calculation
  const getPasswordStrength = (password) => {
    let score = 0;
    if (password.length >= 8) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    return Math.min(score, 4);
  };

  const strength = getPasswordStrength(form.password);

  const strengthText = ["Weak", "Fair", "Good", "Strong"];
  const strengthColor = [
    "bg-rose-500",
    "bg-amber-500",
    "bg-blue-500",
    "bg-emerald-500",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/register", form);
      toast.success("Account created successfully! Please sign in.");
      navigate("/login");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Create Account">
      <div className="bg-zinc-900/80 border border-zinc-800/90 p-8 rounded-2xl shadow-2xl backdrop-blur-xl">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-10 h-10 rounded-xl bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-white mb-3 shadow-inner">
            <SparklesIcon className="w-5 h-5 text-zinc-300" />
          </div>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Create an account
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Get started with AutoResume talent matching
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Role Segmented Selector */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Account Type
            </label>
            <div className="grid grid-cols-2 gap-2 bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "candidate" })}
                className={`py-1.5 rounded-md text-xs font-medium transition ${
                  form.role === "candidate"
                    ? "bg-zinc-800 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Candidate
              </button>
              <button
                type="button"
                onClick={() => setForm({ ...form, role: "recruiter" })}
                className={`py-1.5 rounded-md text-xs font-medium transition ${
                  form.role === "recruiter"
                    ? "bg-zinc-800 text-white shadow-sm font-semibold"
                    : "text-zinc-400 hover:text-zinc-200"
                }`}
              >
                Recruiter
              </button>
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Full name
            </label>
            <input
              type="text"
              placeholder="Alex Johnson"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none transition"
              value={form.name}
              onChange={(e) =>
                setForm({ ...form, name: e.target.value })
              }
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email address
            </label>
            <input
              type="email"
              placeholder="alex@example.com"
              className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none transition"
              value={form.email}
              onChange={(e) =>
                setForm({ ...form, email: e.target.value })
              }
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                className="w-full rounded-lg border border-zinc-800 bg-zinc-950 px-3.5 py-2.5 pr-10 text-xs text-zinc-100 placeholder-zinc-500 focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 focus:outline-none transition"
                value={form.password}
                onChange={(e) =>
                  setForm({ ...form, password: e.target.value })
                }
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-500 hover:text-zinc-300"
              >
                {showPassword ? <EyeOffIcon className="w-4 h-4" /> : <EyeIcon className="w-4 h-4" />}
              </button>
            </div>

            {/* Strength bar */}
            {form.password && (
              <div className="mt-2.5">
                <div className="h-1.5 w-full bg-zinc-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColor[strength - 1]}`}
                    style={{ width: `${(strength / 4) * 100}%` }}
                  />
                </div>
                <div className="flex justify-between items-center text-[11px] text-zinc-500 mt-1">
                  <span>Strength</span>
                  <span className="font-medium text-zinc-300">{strengthText[strength - 1] || "Weak"}</span>
                </div>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-white py-2.5 text-xs font-semibold text-zinc-950 hover:bg-zinc-200 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-sm mt-3"
          >
            {loading ? (
              <>
                <Loader2Icon className="w-4 h-4 animate-spin text-zinc-950" />
                <span>Creating account...</span>
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <p className="text-xs text-center text-zinc-400 mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-white hover:underline font-medium">
            Sign in
          </Link>
        </p>
      </div>
    </Layout>
  );
}
