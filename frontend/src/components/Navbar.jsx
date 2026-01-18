import { Link, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { ThemeContext } from "../context/ThemeContext";
import { UIContext } from "../context/UIContext";
import { MenuIcon, MoonIcon, SunIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { darkMode, setDarkMode } = useContext(ThemeContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
  const location = useLocation();

  const isDashboard =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/candidate") ||
    location.pathname.startsWith("/recruiter");

  return (
    <nav
      className={`
        fixed top-0 right-0 z-50
        ${isDashboard && sidebarOpen ? "md:left-64" : "left-0"}
        bg-blue-600 dark:bg-gray-900
        text-white py-3 shadow transition-all
      `}
    >
      <div className="w-full px-6 flex justify-between items-center">
        <div className="flex items-center gap-4">
          {/* 🍔 Hamburger (admin & dashboard only) */}
          {isDashboard && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-2 rounded-lg bg-blue-500 dark:bg-gray-800 hover:bg-blue-400 transition"
            >
              <MenuIcon className="w-5 h-5" />
            </button>
          )}

          <Link to="/" className="text-xl font-semibold">
            Resume Shortlister
          </Link>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-lg bg-blue-500 dark:bg-gray-800"
          >
            {darkMode ? <SunIcon /> : <MoonIcon />}
          </button>

          {user && (
            <button
              onClick={logout}
              className="bg-white text-blue-600 px-3 py-1.5 rounded"
            >
              Logout
            </button>
          )}
        </div>
      </div>
    </nav>
  );
}
