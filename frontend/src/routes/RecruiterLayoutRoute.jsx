import React from "react";
import RecruiterLayout from "../components/recruiter/RecruiterLayout";
import { Outlet } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

export default function RecruiterLayoutRoute() {
  return (
    <ProtectedRoute allowedRoles={["recruiter"]}>
      <RecruiterLayout>
        <Outlet />
      </RecruiterLayout>
    </ProtectedRoute>
  );
}
