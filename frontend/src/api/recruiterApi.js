import axios from "axios";

const API = "http://localhost:8000/api";

export const createJob = (recruiterId, data) =>
  axios.post(`${API}/jobs`, { recruiterId, ...data });

export const getJobs = () => axios.get(`${API}/jobs`);

export const getRankedResumes = (jobId) =>
  axios.get(`${API}/jobs/rank/${jobId}`);
