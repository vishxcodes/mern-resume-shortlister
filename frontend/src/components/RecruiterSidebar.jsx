import { useContext } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import { UIContext } from "../context/UIContext";
import {
  LayoutDashboardIcon,
  BriefcaseIcon,
  PlusCircleIcon,
  UsersIcon,
  ListFilterIcon,
  UserCircleIcon,
  LogOutIcon,
  XIcon,
  SparklesIcon,
} from "lucide-react";

export default function RecruiterSidebar() {
  const { user, logout } = useContext(AuthContext);
  const { sidebarOpen, setSidebarOpen } = useContext(UIContext);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    setSidebarOpen(false);
    navigate("/login");
  };

  const links = [
    { name: "Overview", path: "/recruiter", icon: <LayoutDashboardIcon className="w-4 h-4" /> },
    { name: "Manage Jobs", path: "/recruiter/jobs", icon: <BriefcaseIcon className="w-4 h-4" /> },
    { name: "Post New Job", path: "/recruiter/post-job", icon: <PlusCircleIcon className="w-4 h-4" /> },
    { name: "All Applicants", path: "/recruiter/applicants", icon: <UsersIcon className="w-4 h-4" /> },
    { name: "Rank Candidates", path: "/recruiter/rank-applicants", icon: <ListFilterIcon className="w-4 h-4" /> },
    { name: "Company Profile", path: "/recruiter/profile", icon: <UserCircleIcon className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile Backdrop Overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden transition-opacity"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed top-0 left-0 h-full w-64 z-50
          bg-zinc-950 border-r border-zinc-800/80
          text-zinc-300 flex flex-col
          transform transition-transform duration-200 ease-in-out
          md:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Brand Header */}
        <div className="h-16 flex items-center justify-between px-6 border-b border-zinc-800/80">
          <Link
            to="/recruiter"
            onClick={() => setSidebarOpen(false)}
            className="flex items-center gap-2.5 font-semibold text-white tracking-tight"
          >
            <div className="w-7 h-7 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-100">
              <SparklesIcon className="w-3.5 h-3.5" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium leading-tight">AutoResume</span>
              <span className="text-[10px] text-zinc-500 font-mono">Recruiter Studio</span>
            </div>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="md:hidden text-zinc-400 hover:text-white p-1 rounded-md"
          >
            <XIcon className="w-4 h-4" />
          </button>
        </div>

        {/* User Card */}
        <div className="p-4 mx-3 my-3 rounded-lg bg-zinc-900/60 border border-zinc-800/60 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-zinc-800 border border-zinc-700/60 flex items-center justify-center text-xs font-semibold text-zinc-200">
            {user?.name ? user.name.charAt(0).toUpperCase() : "R"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-medium text-zinc-200 truncate">{user?.name || "Recruiter"}</p>
            <p className="text-[11px] text-zinc-500 truncate">{user?.company || user?.email || "Hiring Team"}</p>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="px-3 py-1">
          <p className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 px-3 py-1">Hiring Tools</p>
        </div>
        <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
          {links.map((link) => {
            const isActive =
              link.path === "/recruiter"
                ? location.pathname === "/recruiter"
                : location.pathname.startsWith(link.path);

            return (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setSidebarOpen(false)}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                  isActive
                    ? "bg-zinc-900 text-white border border-zinc-800 shadow-sm"
                    : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-900/50"
                }`}
              >
                <span className={isActive ? "text-zinc-100" : "text-zinc-500"}>{link.icon}</span>
                <span>{link.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Footer / Logout */}
        <div className="p-3 border-t border-zinc-800/80">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 w-full rounded-lg text-xs font-medium text-zinc-400 hover:text-rose-400 hover:bg-rose-950/20 transition"
          >
            <LogOutIcon className="w-4 h-4 text-zinc-500" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
