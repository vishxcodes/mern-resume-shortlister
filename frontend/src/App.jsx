import { BrowserRouter as Router, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./context/ThemeContext";
import { UIProvider } from "./context/UIContext";
import ProtectedRoute from "./components/ProtectedRoute";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SparklesIcon, ArrowRightIcon, FileTextIcon, CpuIcon, CheckCircle2Icon } from "lucide-react";

// 🧑‍🎓 Candidate pages
import CandidateDashboard from "./pages/CandidateDashboard";
import CandidateOverview from "./pages/candidate/CandidateOverview";
import CandidateResume from "./pages/candidate/CandidateResume";
import CandidateJobs from "./pages/candidate/CandidateJobs";
import CandidateJobDetails from "./pages/candidate/CandidateJobDetails";
import CandidateApplications from "./pages/candidate/CandidateApplications";

// 🧑‍💼 Recruiter pages
import RecruiterDashboard from "./pages/recruiter/RecruiterDashboard";
import RecruiterOverview from "./pages/recruiter/RecruiterOverview";
import RecruiterJobs from "./pages/recruiter/RecruiterJobs";
import RecruiterPostJob from "./pages/recruiter/RecruiterPostJob";
import RecruiterApplicants from "./pages/recruiter/RecruiterApplicants";
import RecruiterProfile from "./pages/recruiter/RecruiterProfile";
import RecruiterRankJobs from "./pages/recruiter/RecruiterRankJobs";
import RecruiterRankApplicants from "./pages/recruiter/RecruiterRankApplicants";

import Login from "./pages/Login";
import Register from "./pages/Register";

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <UIProvider>
          <Router>
            {/* Global Navbar */}
            <Navbar />

            <Routes>
              {/* Public routes */}
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Candidate protected routes */}
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

              {/* Recruiter protected routes */}
              <Route
                path="/recruiter"
                element={
                  <ProtectedRoute allowedRoles={["recruiter"]}>
                    <RecruiterDashboard />
                  </ProtectedRoute>
                }
              >
                <Route index element={<RecruiterOverview />} />
                <Route path="jobs" element={<RecruiterJobs />} />
                <Route path="post-job" element={<RecruiterPostJob />} />
                <Route path="applicants" element={<RecruiterApplicants />} />
                <Route path="rank-applicants" element={<RecruiterRankJobs />} />
                <Route path="rank-applicants/:jobId" element={<RecruiterRankApplicants />} />
                <Route path="profile" element={<RecruiterProfile />} />
              </Route>

              {/* Catch-all route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>

            {/* Dark toast notifications */}
            <ToastContainer
              position="top-right"
              theme="dark"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              pauseOnHover
            />
          </Router>
        </UIProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user") || "null");

  if (user) {
    if (user.role === "candidate") {
      return <Navigate to="/candidate" replace />;
    }
    if (user.role === "recruiter") {
      return <Navigate to="/recruiter" replace />;
    }
  }

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col justify-between pt-16">
      {/* Background Subtle Grid / Glow */}
      <div className="relative isolate px-6 pt-16 lg:px-8 flex-1 flex flex-col justify-center">
        <div
          aria-hidden="true"
          className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
        >
          <div
            style={{
              clipPath:
                "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
            }}
            className="relative left-[calc(50%-11rem)] aspect-[1155/678] w-[36.125rem] -translate-x-1/2 rotate-[30deg] bg-gradient-to-tr from-zinc-800 to-zinc-900 opacity-30 sm:left-[calc(50%-30rem)] sm:w-[72.1875rem]"
          />
        </div>

        <div className="mx-auto max-w-3xl py-12 text-center">
          {/* Badge */}
          <div className="mb-6 flex justify-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/60 px-3 py-1 text-xs text-zinc-300">
              <SparklesIcon className="w-3.5 h-3.5 text-zinc-400" />
              <span>AI-Powered Talent Matching & Shortlisting</span>
            </div>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white leading-tight">
            Rank resumes with <br className="hidden sm:inline" />
            <span className="text-zinc-400">mathematical precision.</span>
          </h1>

          {/* Description */}
          <p className="mt-6 text-base sm:text-lg leading-relaxed text-zinc-400 max-w-2xl mx-auto">
            Extract clean text from PDFs and DOCX files, vectorize candidates with TF-IDF,
            and rank applicant relevance against job requirements using cosine similarity.
          </p>

          {/* Actions */}
          <div className="mt-10 flex items-center justify-center gap-4 flex-wrap">
            <Link
              to="/register"
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 hover:bg-zinc-200 transition shadow-sm"
            >
              <span>Get Started</span>
              <ArrowRightIcon className="w-4 h-4" />
            </Link>
            <Link
              to="/login"
              className="rounded-lg border border-zinc-800 bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-zinc-200 hover:bg-zinc-800 hover:text-white transition"
            >
              Sign In
            </Link>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="mx-auto max-w-5xl pb-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200 mb-4">
              <FileTextIcon className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-1.5">Smart Parsing</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Automatic text extraction from PDF and Word documents with robust fallbacks and clean formatting.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200 mb-4">
              <CpuIcon className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-1.5">TF-IDF Vectorization</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Scikit-learn cosine similarity computes relevance scores between job descriptions and resume text.
            </p>
          </div>

          <div className="p-6 rounded-xl bg-zinc-900/50 border border-zinc-800/80 hover:border-zinc-700 transition">
            <div className="w-10 h-10 rounded-lg bg-zinc-800/80 border border-zinc-700/60 flex items-center justify-center text-zinc-200 mb-4">
              <CheckCircle2Icon className="w-5 h-5" />
            </div>
            <h2 className="text-sm font-semibold text-white mb-1.5">Instant Shortlisting</h2>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Recruiters inspect matched candidates, preview parsed documents, and update hiring statuses seamlessly.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-900 py-6 text-center text-xs text-zinc-600">
        <p>© 2026 AutoResume. Minimalist hiring intelligence.</p>
      </footer>
    </div>
  );
}
