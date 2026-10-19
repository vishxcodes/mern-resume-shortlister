import Sidebar from "../../components/RecruiterSidebar";
import Breadcrumb from "../../components/Breadcrumb";
import { Outlet, useLocation } from "react-router-dom";
import { motion } from "framer-motion";

export default function RecruiterDashboard() {
  const location = useLocation();

  return (
    <div className="flex min-h-screen bg-[#09090b] text-zinc-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 md:ml-64 pt-20 px-4 sm:px-8 pb-12 w-full max-w-7xl">
        <Breadcrumb />

        {/* Page transitions */}
        <motion.div
          key={location.pathname}
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25, ease: "easeOut" }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
}
