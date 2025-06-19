import axios from 'axios';
import { store } from '../redux/store';
import { logout } from '../redux/auth/authSlice';

// Response interceptor to handle auth errors
axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // If error is related to logout API call, suppress the console error and silently continue
    if (error.config && error.config.url && error.config.url.includes('/auth/logout')) {
      // Create a custom hidden error to avoid polluting the console
      const silentError = new Error("Logout request failed silently");
      silentError.name = "SilentLogoutError";
      silentError.isLogoutError = true;
      return Promise.reject(silentError);
    }
    
    // If the error has a response and the status is 401 (Unauthorized)
    if (error.response && error.response.status === 401) {
      // Check if we're not already on the login or register pages
      const currentPath = window.location.pathname;
      if (
        !currentPath.includes('/login') && 
        !currentPath.includes('/register') &&
        !currentPath.includes('/')
      ) {
        console.log('Unauthorized access detected, logging out...');
        // Dispatch logout action to clear auth state
        store.dispatch(logout());
      }
    }
    return Promise.reject(error);
  }
);

// This module is side-effect only, so we export a named constant
const interceptorSetup = {};
export default interceptorSetup;
