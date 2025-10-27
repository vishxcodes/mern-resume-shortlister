import React from "react";
import RecruiterSidebar from "./RecruiterSidebar";

const RecruiterLayout = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <RecruiterSidebar />

      {/* Main content */}
      <main className="flex-1 ml-64 pt-20 p-8 text-gray-800 dark:text-gray-100">
        {children}
      </main>
    </div>
  );
};

export default RecruiterLayout;
