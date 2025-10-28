import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { MoonIcon, SunIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const location = useLocation();

  // Recruiter or Candidate dashboard route?
  const isDashboard =
    location.pathname.startsWith("/recruiter") ||
    location.pathname.startsWith("/candidate");

  return (
    <nav
      className={`
        fixed top-0 ${isDashboard ? "left-64" : "left-0"} right-0 z-50
        bg-blue-600 dark:bg-gray-900
        text-white dark:text-gray-100
        py-3 shadow transition-all duration-300
      `}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link
          to="/"
          className="text-xl font-semibold hover:text-blue-200 dark:hover:text-gray-300 transition"
        >
          Resume Shortlister
        </Link>

        <div className="flex items-center gap-4">
          {/* 🌙 Theme toggle */}
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-blue-500 dark:bg-gray-800 hover:bg-blue-400 dark:hover:bg-gray-700 transition"
            title="Toggle theme"
          >
            {darkMode ? (
              <SunIcon className="w-5 h-5" />
            ) : (
              <MoonIcon className="w-5 h-5" />
            )}
          </button>

          {/* Auth buttons */}
          {user ? (
            <>
              <span className="text-sm opacity-90">{user.name}</span>
              <button
                onClick={logout}
                className="bg-white text-blue-600 dark:bg-gray-700 dark:text-gray-200 font-medium px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 dark:hover:text-gray-300 transition text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 dark:bg-gray-700 dark:text-gray-200 font-medium px-3 py-1.5 rounded hover:bg-blue-100 dark:hover:bg-gray-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
