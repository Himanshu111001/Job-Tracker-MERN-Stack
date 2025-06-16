import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get admin dashboard stats
const getStats = async () => {
  const response = await axios.get(`${API_URL}/admin/stats`);
  return response.data;
};

// Get all users
const getUsers = async () => {
  const response = await axios.get(`${API_URL}/admin/users`);
  return response.data;
};

// Update user role
const updateUserRole = async (userId, role) => {
  const response = await axios.put(`${API_URL}/admin/users/${userId}/role`, { role });
  return response.data;
};

// Delete user
const deleteUser = async (userId) => {
  const response = await axios.delete(`${API_URL}/admin/users/${userId}`);
  return response.data;
};

const adminService = {
  getStats,
  getUsers,
  updateUserRole,
  deleteUser
};

export default adminService;
