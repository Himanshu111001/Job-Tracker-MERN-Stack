import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/auth/authSlice';
import { addRealTimeNotification } from './redux/notifications/notificationSlice';
import { io } from 'socket.io-client';
import { setAuthToken } from './utils/setAuthToken';
// Import axios interceptors for authentication error handling
import './utils/axiosInterceptors';

// Layout Components
import ProtectedRoute from './components/routing/ProtectedRoute';
import AdminRoute from './components/routing/AdminRoute';
import DashboardLayout from './components/layouts/DashboardLayout';

// Public Pages
import Landing from './pages/public/Landing';
import Login from './pages/public/Login';
import Register from './pages/public/Register';
import NotFound from './pages/public/NotFound';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import JobsList from './pages/dashboard/jobs/JobsList';
import JobDetail from './pages/dashboard/jobs/JobDetail';
import AddJob from './pages/dashboard/jobs/AddJob';
import EditJob from './pages/dashboard/jobs/EditJob';
import Profile from './pages/dashboard/Profile';
import Notifications from './pages/dashboard/Notifications';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import UserManagement from './pages/admin/UserManagement';

// API URL
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading } = useSelector((state) => state.auth);
  
  // Load user on first render if token exists
  useEffect(() => {
    // Set the auth token for axios on app initialization
    const token = localStorage.getItem('token');
    if (token) {
      setAuthToken(token);
      dispatch(loadUser());
    }
  }, [dispatch]);  // Connect to Socket.io when user is authenticated
  useEffect(() => {
    let socket;
    
    if (isAuthenticated && user) {
      // Create socket connection
      socket = io(API_URL.replace('/api', ''), {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5
      });
      
      // Join user's room for personalized notifications
      socket.on('connect', () => {
        console.log('Socket connected, joining room for user:', user.id);
        socket.emit('joinRoom', user.id);
      });      
      
      // Handle connection errors
      socket.on('connect_error', (error) => {
        console.error('Socket connection error:', error);
      });
      
      // Listen for notifications
      socket.on('notification', (notification) => {
        // Log the notification and dispatch action to add it to the store
        console.log('New notification received:', notification);
        
        // Ensure the notification is properly added to Redux store
        dispatch(addRealTimeNotification(notification));
        
        // You could also use a toast notification here if desired
        // toast.success(`New notification: ${notification.title}`);
      });
    }
    
    // Cleanup function
    return () => {
      if (socket) {
        console.log('Socket disconnecting');
        socket.off('notification');
        socket.off('connect');
        socket.off('connect_error');
        socket.disconnect();
      }
    };
  }, [isAuthenticated, user, dispatch]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landing />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route index element={<Dashboard />} />
        <Route path="jobs">
          <Route index element={<JobsList />} />
          <Route path="add" element={<AddJob />} />
          <Route path=":jobId" element={<JobDetail />} />
          <Route path=":jobId/edit" element={<EditJob />} />
        </Route>
        <Route path="profile" element={<Profile />} />
        <Route path="notifications" element={<Notifications />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <AdminRoute>
          <DashboardLayout />
        </AdminRoute>
      }>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Catch All/404 */}
      <Route path="/404" element={<NotFound />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;
