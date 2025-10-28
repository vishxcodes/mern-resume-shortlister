import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Navigate } from "react-router-dom"


// Candidate pages
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateOverview from "./pages/candidate/CandidateOverview";
import CandidateResume from "./pages/candidate/CandidateResume";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateJobDetails from "./pages/candidate/CandidateJobDetails";
import CandidateApplications from "./pages/candidate/CandidateApplications";

// Recruiter pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import CreateJobPage from "./pages/recruiter/CreateJobPage";
import MyJobsPage from "./pages/recruiter/MyJobsPage";
import ViewRankedResumesPage from "./pages/recruiter/ViewRankedResumesPage";
import ProfilePage from "./pages/recruiter/ProfilePage";
import RecruiterLayout from "./components/recruiter/RecruiterLayout"; 

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          {/* 🌍 Global Navbar (works for all roles) */}
          <Navbar />

          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Candidate protected routes */}
            <Route
              path="/candidate"
              element={
                <ProtectedRoute allowedRoles={["candidate"]}>
                  <CandidateDashboard />
                </ProtectedRoute>
              }
            >
              <Route index element={<CandidateOverview />} />
              <Route path="resume" element={<CandidateResume />} />
              <Route path="jobs" element={<CandidateJobs />} />
              <Route path="jobs/:id" element={<CandidateJobDetails />} />
              <Route path="applications" element={<CandidateApplications />} />
            </Route>

            import RecruiterLayoutRoute from "./routes/RecruiterLayoutRoute";


  {/* ✅ Recruiter routes */}
  <Route path="/recruiter" element={<RecruiterLayoutRoute />}>
    <Route path="dashboard" element={<RecruiterDashboard />} />
    <Route path="create-job" element={<CreateJobPage />} />
    <Route path="my-jobs" element={<MyJobsPage />} />
    <Route path="rank/:jobId" element={<ViewRankedResumesPage />} />
    <Route path="profile" element={<ProfilePage />} />
  </Route>
</Routes>


          <ToastContainer position="top-right" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900">
        <h1 className="text-3xl font-bold mb-4 text-blue-700 dark:text-gray-100">
          Welcome to Resume Shortlister
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">
          Please login or register to continue.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Register
          </a>
        </div>
      </div>
    );

  // redirect logged-in user to appropriate dashboard
  return user.role === "recruiter" ? (
    <RecruiterDashboard />
  ) : (
    <CandidateDashboard />
  );
}
