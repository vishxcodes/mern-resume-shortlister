import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

const RecruiterSidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();

const navItems = [
  { label: "Dashboard", path: "/recruiter/dashboard" },
  { label: "Post a Job", path: "/recruiter/create-job" },
  { label: "My Jobs", path: "/recruiter/my-jobs" },
  { label: "Profile", path: "/recruiter/profile" },
];


  return (
    <aside
      className="
        fixed top-0 left-0 w-64 h-screen 
        bg-gray-100 dark:bg-gray-900 
        text-gray-800 dark:text-gray-100 
        border-r border-gray-200 dark:border-gray-700 
        pt-16 z-30 transition-colors duration-300"
    >
      {navItems.map((item) => (
        <button
          key={item.path}
          onClick={() => navigate(item.path)}
          className={`block w-full text-left px-6 py-3 font-medium transition 
            ${
              location.pathname === item.path
                ? "bg-blue-600 text-white dark:bg-blue-700"
                : "hover:bg-gray-200 dark:hover:bg-gray-800"
            }`}
        >
          {item.label}
        </button>
      ))}
    </aside>
  );
};

export default RecruiterSidebar;
