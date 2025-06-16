import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }

  return response.data;
};

// Logout user
const logout = async () => {
  const response = await axios.get(`${API_URL}/auth/logout`);
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  return response.data;
};

// Get current user
const getMe = async () => {
  const response = await axios.get(`${API_URL}/auth/me`);
  return response.data;
};

// Update profile
const updateProfile = async (userData) => {
  const response = await axios.put(`${API_URL}/users/profile`, userData);
  return response.data;
};

const authService = {
  register,
  login,
  logout,
  getMe,
  updateProfile
};

export default authService;
