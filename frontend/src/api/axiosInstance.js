import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api", // backend running at port 8000
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export default API;
