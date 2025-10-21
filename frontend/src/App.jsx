import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import CandidateOverview from "./pages/candidate/CandidateOverview";
import CandidateResume from "./pages/candidate/CandidateResume";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider } from "./context/ThemeContext";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* ✅ Protected candidate dashboard with nested routes */}
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
            </Route>

            {/* ✅ Protected recruiter dashboard */}
            <Route
              path="/recruiter"
              element={
                <ProtectedRoute allowedRoles={["recruiter"]}>
                  <RecruiterDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
          <ToastContainer position="top-right" />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

/* --------------------- HOMEPAGE COMPONENT --------------------- */
function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user)
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-4 text-blue-700">
          Welcome to Resume Shortlister
        </h1>
        <p className="text-gray-600 mb-6">
          Please login or register to continue.
        </p>
        <div className="flex gap-4">
          <a
            href="/login"
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Login
          </a>
          <a
            href="/register"
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
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
