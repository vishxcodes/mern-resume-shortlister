import { useLocation, Link } from "react-router-dom";
import { ChevronRightIcon } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  const isRecruiter = location.pathname.startsWith("/recruiter");
  const homePath = isRecruiter ? "/recruiter" : "/candidate";

  const formatPath = (segment) => {
    // Replace hyphens with spaces and capitalize
    return segment
      .replace(/-/g, " ")
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <nav className="flex items-center text-xs text-zinc-500 mb-6 font-medium">
      <Link
        to={homePath}
        className="hover:text-zinc-200 transition"
      >
        {isRecruiter ? "Recruiter" : "Candidate"}
      </Link>

      {pathnames.slice(1).map((name, index) => {
        // Construct route
        const routeTo = "/" + pathnames.slice(0, index + 2).join("/");
        const isLast = index === pathnames.length - 2;

        return (
          <div key={routeTo} className="flex items-center">
            <ChevronRightIcon className="w-3.5 h-3.5 mx-1.5 text-zinc-600" />
            {isLast ? (
              <span className="text-zinc-300 font-semibold">
                {formatPath(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="hover:text-zinc-200 transition"
              >
                {formatPath(name)}
              </Link>
            )}
          </div>
        );
      })}
    </nav>
  );
}
