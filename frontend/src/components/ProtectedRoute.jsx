import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    // if not logged in or not allowed
    if (!user || (allowedRoles && !allowedRoles.includes(user.role))) {
      navigate("/"); // redirect to landing page
    }
  }, [user, allowedRoles, navigate]);

  return children;
}
