import { useState, useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import {
  BriefcaseIcon,
  FilePlusIcon,
  UsersIcon,
  LogOutIcon,
  MenuIcon,
  XIcon,
  UserIcon,
  LayoutDashboardIcon,
} from "lucide-react";

export default function RecruiterSidebar() {
  const { user, logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const links = [
    { name: "Dashboard", path: "/recruiter", icon: <LayoutDashboardIcon className="w-5 h-5" /> },
    { name: "My Jobs", path: "/recruiter/jobs", icon: <BriefcaseIcon className="w-5 h-5" /> },
    { name: "Post Job", path: "/recruiter/post-job", icon: <FilePlusIcon className="w-5 h-5" /> },
    { name: "Applicants", path: "/recruiter/applicants", icon: <UsersIcon className="w-5 h-5" /> },
    { name: "Profile", path: "/recruiter/profile", icon: <UserIcon className="w-5 h-5" /> },
  ];

  return (
    <>
      {/* Mobile toggle */}
      <button
        className="md:hidden fixed top-4 left-4 z-50 bg-blue-600 dark:bg-gray-800 text-white p-2 rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <XIcon className="w-5 h-5" /> : <MenuIcon className="w-5 h-5" />}
      </button>

      {/* Sidebar */}
      <aside
        className={`${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } fixed md:static top-0 left-0 h-full w-64 
        bg-gradient-to-b from-blue-700 to-blue-600 
        dark:from-gray-900 dark:to-gray-800
        text-white flex flex-col 
        transition-all duration-500 ease-in-out 
        shadow-lg z-40`}
      >
        <div className="text-2xl font-bold text-center py-5 border-b border-blue-500 dark:border-gray-700">
          Recruiter Panel
        </div>

        <div className="p-4 border-b border-blue-500 dark:border-gray-700 flex items-center gap-3 bg-blue-800/50 dark:bg-gray-800/50">
          <div className="bg-blue-500 dark:bg-gray-700 p-2 rounded-full">
            <UserIcon className="w-5 h-5" />
          </div>
          <div>
            <p className="font-semibold text-sm">{user?.name || "Recruiter"}</p>
            <p className="text-xs opacity-80 capitalize">{user?.role || "recruiter"}</p>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-all ${
                  isActive
                    ? "bg-white text-blue-700 font-semibold shadow-inner dark:bg-gray-700 dark:text-white"
                    : "hover:bg-blue-500/50 dark:hover:bg-gray-700/60"
                }`}
              >
                {link.icon}
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

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
