import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import notificationService from '../../services/notificationService';

const initialState = {
  notifications: [],
  loading: false,
  error: null,
  success: false,
  unreadCount: 0
};

// Get all notifications
export const getNotifications = createAsyncThunk(
  'notifications/getNotifications',
  async (_, thunkAPI) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark notification as read
export const markNotificationRead = createAsyncThunk(
  'notifications/markNotificationRead',
  async (id, thunkAPI) => {
    try {
      return await notificationService.markNotificationRead(id);
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Mark all notifications as read
export const markAllNotificationsRead = createAsyncThunk(
  'notifications/markAllRead',
  async (_, thunkAPI) => {
    try {
      return await notificationService.markAllNotificationsRead();
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (id, thunkAPI) => {
    try {
      await notificationService.deleteNotification(id);
      return id;
    } catch (error) {
      const message = 
        (error.response && 
          error.response.data && 
          error.response.data.error) || 
        error.message || 
        error.toString();
      
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// Add a real-time notification
export const addRealTimeNotification = createAsyncThunk(
  'notifications/addRealTimeNotification',
  async (notification, thunkAPI) => {
    return notification;
  }
);

export const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    resetNotificationState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Notifications
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notifications = action.payload.data;
        state.unreadCount = action.payload.data.filter(n => !n.read).length;
        state.success = true;
      })
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Mark Notification Read
      .addCase(markNotificationRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.loading = false;
        
        // Update the notification in state
        state.notifications = state.notifications.map(notification => 
          notification._id === action.payload.data._id 
            ? { ...notification, read: true }
            : notification
        );
        
        // Recalculate unread count
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        
        state.success = true;
      })
      .addCase(markNotificationRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Mark All Notifications Read
      .addCase(markAllNotificationsRead.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.loading = false;
        
        // Mark all notifications as read
        state.notifications = state.notifications.map(notification => ({
          ...notification,
          read: true
        }));
        
        // Reset unread count
        state.unreadCount = 0;
        
        state.success = true;
      })
      .addCase(markAllNotificationsRead.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete Notification
      .addCase(deleteNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.loading = false;
        
        // Remove the notification from state
        state.notifications = state.notifications.filter(
          notification => notification._id !== action.payload
        );
        
        // Recalculate unread count
        state.unreadCount = state.notifications.filter(n => !n.read).length;
        
        state.success = true;
      })
      .addCase(deleteNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Add Real-time Notification
      .addCase(addRealTimeNotification.fulfilled, (state, action) => {
        state.notifications = [action.payload, ...state.notifications];
        state.unreadCount += 1;
      });
  }
});

export const { resetNotificationState } = notificationSlice.actions;

export default notificationSlice.reducer;
