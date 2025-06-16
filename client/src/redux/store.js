import { configureStore } from '@reduxjs/toolkit';
import authReducer from './auth/authSlice';
import jobReducer from './jobs/jobSlice';
import notificationReducer from './notifications/notificationSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    jobs: jobReducer,
    notifications: notificationReducer
  },
});
