import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loadUser } from './redux/auth/authSlice';
import { io } from 'socket.io-client';

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
    dispatch(loadUser());
  }, [dispatch]);

  // Connect to Socket.io when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      const socket = io(API_URL.replace('/api', ''));
      
      // Join user's room for personalized notifications
      socket.on('connect', () => {
        socket.emit('joinRoom', user.id);
      });

      // Listen for notifications
      socket.on('notification', (notification) => {
        // Here you would dispatch an action to add the notification
        console.log('New notification:', notification);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [isAuthenticated, user]);

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
