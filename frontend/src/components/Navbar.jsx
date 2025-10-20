import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="bg-blue-600 text-white py-3 shadow">
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <Link to="/" className="text-xl font-semibold hover:text-blue-200 transition">
          Resume Shortlister
        </Link>

        <div className="flex items-center gap-4">
          {user ? (
            <>
              <span className="text-sm opacity-90">Hi, {user.name}</span>
              <button
                onClick={logout}
                className="bg-white text-blue-600 font-medium px-3 py-1.5 rounded hover:bg-blue-100 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="hover:text-blue-200 transition text-sm font-medium"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-white text-blue-600 font-medium px-3 py-1.5 rounded hover:bg-blue-100 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
