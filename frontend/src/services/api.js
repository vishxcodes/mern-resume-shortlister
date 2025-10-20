import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000", // your backend URL
});

// Example: signup
export const signupUser = (data) => API.post("/register", data);

// Example: login
export const loginUser = (data) => API.post("/login", data);

// Example: fetch dashboard data
export const getDashboardData = (token) =>
  API.get("/dashboard", {
    headers: { Authorization: `Bearer ${token}` },
  });
