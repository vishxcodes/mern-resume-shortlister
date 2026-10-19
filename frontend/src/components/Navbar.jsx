import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { UIContext } from "../context/UIContext";
import { MenuIcon, LogOutIcon, SparklesIcon, UserIcon } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
  const location = useLocation();
  const navigate = useNavigate();

  const isDashboard =
    location.pathname.startsWith("/candidate") ||
    location.pathname.startsWith("/recruiter");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`
        fixed top-0 right-0 z-40 h-16
        ${isDashboard ? "md:left-64 left-0" : "left-0"}
        bg-zinc-950/85 backdrop-blur-md border-b border-zinc-800/80
        text-zinc-100 transition-all duration-200
      `}
    >
      <div className="w-full h-full px-6 flex justify-between items-center">
        {/* Left Section */}
        <div className="flex items-center gap-3">
          {/* Hamburger toggle for mobile */}
          {isDashboard && (
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              aria-label="Toggle Navigation Sidebar"
              className="md:hidden p-2 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition"
            >
              <MenuIcon className="w-4 h-4" />
            </button>
          )}

          {/* Logo (Shown on mobile or when not in dashboard) */}
          <Link
            to="/"
            className="flex items-center gap-2.5 text-base font-semibold tracking-tight text-white hover:opacity-90 transition"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100 shadow-sm">
              <SparklesIcon className="w-4 h-4 text-zinc-200" />
            </div>
            <span className="font-medium text-sm sm:text-base">
              Auto<span className="text-zinc-400">Resume</span>
            </span>
          </Link>

          {isDashboard && (
            <span className="hidden sm:inline-flex text-xs font-mono uppercase tracking-wider text-zinc-500 bg-zinc-900/60 border border-zinc-800/60 px-2 py-0.5 rounded ml-2">
              {location.pathname.startsWith("/recruiter") ? "Recruiter" : "Candidate"}
            </span>
          )}
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-lg bg-zinc-900/80 border border-zinc-800/80 text-xs">
                <UserIcon className="w-3.5 h-3.5 text-zinc-400" />
                <span className="text-zinc-200 font-medium">{user.name}</span>
                <span className="text-zinc-500 font-mono capitalize">({user.role})</span>
              </div>

              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 text-xs font-medium text-zinc-300 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 px-3 py-1.5 rounded-lg transition"
              >
                <LogOutIcon className="w-3.5 h-3.5" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-medium text-zinc-300 hover:text-white px-3 py-1.5 rounded-lg hover:bg-zinc-900 transition"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="text-xs font-medium bg-white text-zinc-950 hover:bg-zinc-200 px-3.5 py-1.5 rounded-lg font-medium transition shadow-sm"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
