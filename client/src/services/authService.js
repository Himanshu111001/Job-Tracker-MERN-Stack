import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Register user
const register = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/register`, userData);

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Set the auth token in axios headers
    const { setAuthToken } = require('../utils/setAuthToken');
    setAuthToken(response.data.token);
  }

  return response.data;
};

// Login user
const login = async (userData) => {
  const response = await axios.post(`${API_URL}/auth/login`, userData);

  if (response.data && response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
    
    // Set the auth token in axios headers
    const { setAuthToken } = require('../utils/setAuthToken');
    setAuthToken(response.data.token);
  }

  return response.data;
};

// Logout user
const logout = async () => {  try {
    // Get token directly from localStorage to ensure it's included in this request
    const token = localStorage.getItem('token');
    
    // If token exists, include it explicitly in this request
    if (token) {
      await axios.get(`${API_URL}/auth/logout`, {
        headers: {
          'Authorization': `Bearer ${token}`
        },
        // This makes axios not log this particular request in console
        silentErrors: true
      });
    }
  } catch (error) {
    // Silent fail - no console warnings or errors for logout requests
    // This keeps the console clean during logout
  }
  
  // After the API call (successful or not), clear local storage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  
  return { success: true };
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
