import { useState } from "react";
import { Link } from "react-router-dom";
import API from "../api/axiosInstance";
import { toast } from "react-toastify";
import Layout from "../components/Layout";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

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
    "bg-red-500",
    "bg-yellow-500",
    "bg-blue-500",
    "bg-green-600",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/users/register", form);
      toast.success("Account created successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout title="Candidate Registration">
      <div className="max-w-md mx-auto mt-16">
        <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-xl border border-white/10">
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
            Create an account
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            Register as a candidate to get started
          </p>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Full name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Email address
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-lg border px-4 py-3 focus:ring-2 focus:ring-green-500 focus:outline-none"
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                required
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Password
              </label>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Create a strong password"
                  className="w-full rounded-lg border px-4 py-3 pr-10 focus:ring-2 focus:ring-green-500 focus:outline-none"
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  required
                />

                {/* Eye icon */}
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              {/* Strength bar */}
              {form.password && (
                <div className="mt-3">
                  <div className="h-2 w-full bg-gray-200 rounded">
                    <div
                      className={`h-2 rounded transition-all ${strengthColor[strength - 1]}`}
                      style={{ width: `${(strength / 4) * 100}%` }}
                    />
                  </div>

                  <p className="text-sm mt-1 text-gray-600">
                    Strength:{" "}
                    <span className="font-medium">
                      {strengthText[strength - 1] || "Weak"}
                    </span>
                  </p>
                </div>
              )}

              {/* Password suggestions */}
              <ul className="text-xs text-gray-500 mt-2 space-y-1">
                <li>• At least 8 characters</li>
                <li>• One uppercase & one lowercase letter</li>
                <li>• One number</li>
                <li>• One special character (!@#$%)</li>
              </ul>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-green-600 py-3 font-semibold text-white
              hover:bg-green-700 transition disabled:opacity-60"
            >
              {loading ? "Creating account..." : "Register"}
            </button>
          </form>

          <p className="text-sm text-center text-gray-500 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-green-600 hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </Layout>
  );
}
