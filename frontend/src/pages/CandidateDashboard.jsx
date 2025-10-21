import Sidebar from "../components/Sidebar";
import Breadcrumb from "../components/Breadcrumb";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function CandidateDashboard() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors duration-300">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 p-10 md:ml-64 transition-all">
        <Breadcrumb />

        {/* ✨ Fade-in only animation */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
