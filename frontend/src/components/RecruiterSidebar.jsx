import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UIContext } from "../context/UIContext";
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  UsersIcon,
  FileTextIcon,
  FilePlusIcon,
  XIcon,
  UserIcon,
  LogOutIcon,
} from "lucide-react";

export default function RecruiterSidebar() {
  const { user, logout } = useContext(AuthContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/");
  };

  const links = [
    { name: "Dashboard", path: "/recruiter", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { name: "My Jobs", path: "/recruiter/jobs", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: "Post Job", path: "/recruiter/post-job", icon: <FilePlusIcon className="w-5 h-5" /> },
    { name: "Applicants", path: "/recruiter/applicants", icon: <UsersIcon className="w-5 h-5" /> },
    { name: "Rank Applicants", path: "/recruiter/rank-applicants", icon: <FileTextIcon className="w-5 h-5" /> },
    { name: "Profile", path: "/recruiter/profile", icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-30"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-40
          bg-gradient-to-b from-blue-700 to-blue-600
          dark:from-gray-900 dark:to-gray-800
          text-white flex flex-col shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-blue-500 dark:border-gray-700">
          <h2 className="text-lg font-bold">Recruiter Panel</h2>
          <button onClick={() => setSidebarOpen(false)}>
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        {/* User info */}
        <div className="p-4 border-b border-blue-500 dark:border-gray-700 flex items-center gap-3 bg-blue-800/50 dark:bg-gray-800/50">
          <div className="bg-blue-500 dark:bg-gray-700 p-2 rounded-full">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.name || "Recruiter"}</p>
            <p className="text-xs opacity-80 capitalize">{user?.role || "recruiter"}</p>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold dark:bg-gray-700 dark:text-white"
                    : "hover:bg-blue-500/50 dark:hover:bg-gray-700/60"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-blue-500 dark:border-gray-700">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg hover:bg-blue-500/50 dark:hover:bg-gray-700/60 transition"
          >
            <LogOutIcon className="w-5 h-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
