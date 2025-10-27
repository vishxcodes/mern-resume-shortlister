import React from "react";
import { useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";

const RecruiterNavbar = ({ darkMode, setDarkMode }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  return (
    <nav className="bg-[#0f172a] dark:bg-gray-800 text-white flex justify-between items-center px-6 py-3 shadow-md transition-colors duration-300">
      <h1
        className="text-xl font-semibold cursor-pointer"
        onClick={() => navigate("/recruiter/dashboard")}
      >
        Resume Shortlister
      </h1>

      <div className="flex items-center space-x-4">
        {/* Theme Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="bg-gray-700 hover:bg-gray-600 p-2 rounded-md transition"
          aria-label="Toggle theme"
        >
          {darkMode ? (
            <Sun className="h-5 w-5 text-yellow-300" />
          ) : (
            <Moon className="h-5 w-5 text-gray-200" />
          )}
        </button>

        {/* Username */}
        <span className="text-gray-200 font-medium">{user?.name}</span>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="bg-gray-700 hover:bg-gray-600 px-3 py-1.5 rounded text-sm font-medium transition"
        >
          Logout
        </button>
      </div>
    </nav>
  );
};

export default RecruiterNavbar;
