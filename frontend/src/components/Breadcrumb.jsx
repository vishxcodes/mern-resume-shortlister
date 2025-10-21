import { useLocation, Link } from "react-router-dom";
import { HomeIcon, ChevronRightIcon } from "lucide-react";

export default function Breadcrumb() {
  const location = useLocation();
  const pathnames = location.pathname.split("/").filter((x) => x);

  // Function to prettify the path segments
  const formatPath = (segment) =>
    segment.charAt(0).toUpperCase() + segment.slice(1);

  return (
    <nav className="flex items-center text-sm text-gray-600 mb-6">
      <Link
        to="/candidate"
        className="flex items-center text-blue-600 hover:text-blue-700 transition"
      >
        <HomeIcon className="w-4 h-4 mr-1" />
        Dashboard
      </Link>

      {pathnames.map((name, index) => {
        const routeTo = "/" + pathnames.slice(0, index + 1).join("/");
        const isLast = index === pathnames.length - 1;

        return (
          <div key={routeTo} className="flex items-center">
            <ChevronRightIcon className="w-4 h-4 mx-1 text-gray-400" />
            {isLast ? (
              <span className="text-gray-500 font-medium">
                {formatPath(name)}
              </span>
            ) : (
              <Link
                to={routeTo}
                className="text-blue-600 hover:text-blue-700 transition"
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
