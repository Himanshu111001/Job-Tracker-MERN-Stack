import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Get all notifications
const getNotifications = async () => {
  const response = await axios.get(`${API_URL}/notifications`);
  return response.data;
};

// Mark notification as read
const markNotificationRead = async (notificationId) => {
  const response = await axios.put(`${API_URL}/notifications/${notificationId}`);
  return response.data;
};

// Mark all notifications as read
const markAllNotificationsRead = async () => {
  const response = await axios.put(`${API_URL}/notifications`);
  return response.data;
};

// Delete notification
const deleteNotification = async (notificationId) => {
  const response = await axios.delete(`${API_URL}/notifications/${notificationId}`);
  return response.data;
};

const notificationService = {
  getNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification
};

export default notificationService;
