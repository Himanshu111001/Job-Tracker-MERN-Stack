import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all jobs
const getJobs = async (params = {}) => {
  // Build query string from params
  const queryParams = new URLSearchParams();
  
  if (params.status) {
    queryParams.append('status', params.status);
  }
  
  if (params.sort) {
    queryParams.append('sort', params.sort);
  }
  
  if (params.page) {
    queryParams.append('page', params.page);
  }
  
  if (params.limit) {
    queryParams.append('limit', params.limit);
  }
  
  const queryString = queryParams.toString();
  const url = queryString ? `${API_URL}/jobs?${queryString}` : `${API_URL}/jobs`;
  
  const response = await axios.get(url);
  return response.data;
};

// Get job by id
const getJobById = async (jobId) => {
  const response = await axios.get(`${API_URL}/jobs/${jobId}`);
  return response.data;
};

// Create new job
const createJob = async (jobData) => {
  const response = await axios.post(`${API_URL}/jobs`, jobData);
  return response.data;
};

// Update job
const updateJob = async (jobId, jobData) => {
  console.log("JobService: Updating job with ID:", jobId);
  console.log("JobService: Job data:", jobData);
  const response = await axios.put(`${API_URL}/jobs/${jobId}`, jobData);
  return response.data;
};

// Delete job
const deleteJob = async (jobId) => {
  const response = await axios.delete(`${API_URL}/jobs/${jobId}`);
  return response.data;
};

// Get dashboard stats
const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/users/dashboard`);
  return response.data;
};

const jobService = {
  getJobs,
  getJobById,
  createJob,
  updateJob,
  deleteJob,
  getDashboardStats
};

export default jobService;
