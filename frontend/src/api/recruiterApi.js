import API from "./axiosInstance";

export const createJob = (recruiterId, data) =>
  API.post("/jobs", { recruiterId, ...data });

export const getJobs = () => API.get("/jobs");

export const getRankedResumes = (jobId) =>
  API.get(`/jobs/rank/${jobId}`);
