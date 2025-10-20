import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import { AuthProvider } from "./context/AuthContext";
import Login from "./pages/Login";
import Register from "./pages/Register";
import CandidateDashboard from "./pages/CandidateDashboard";
import RecruiterDashboard from "./pages/RecruiterDashboard";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/candidate" element={<CandidateDashboard />} />
          <Route path="/recruiter" element={<RecruiterDashboard />} />
        </Routes>
        <ToastContainer position="top-right" />
      </Router>
    </AuthProvider>
  );
}

function HomePage() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-gray-50">
        <h1 className="text-3xl font-bold mb-4">Welcome to Resume Shortlister 👋</h1>
        <p className="text-gray-600 mb-6">Please login or register to continue.</p>
        <div className="flex gap-4">
          <a href="/login" className="bg-blue-600 text-white px-4 py-2 rounded">Login</a>
          <a href="/register" className="bg-green-600 text-white px-4 py-2 rounded">Register</a>
        </div>

      </div>
    );
  }

  return user.role === "recruiter" ? <RecruiterDashboard /> : <CandidateDashboard />;
}
