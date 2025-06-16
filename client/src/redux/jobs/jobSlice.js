import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';

const initialState = {
  jobs: [],
  job: null,
  totalJobs: 0,
  statusCounts: {},
  loading: false,
  error: null,
  success: false
};

// Get all jobs
export const getJobs = createAsyncThunk(
  'jobs/getJobs',
  async (params, thunkAPI) => {
    try {
      return await jobService.getJobs(params);
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

// Get job by id
export const getJobById = createAsyncThunk(
  'jobs/getJobById',
  async (id, thunkAPI) => {
    try {
      return await jobService.getJobById(id);
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

// Create new job
export const createJob = createAsyncThunk(
  'jobs/createJob',
  async (jobData, thunkAPI) => {
    try {
      return await jobService.createJob(jobData);
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

// Update job
export const updateJob = createAsyncThunk(
  'jobs/updateJob',
  async ({ id, jobData }, thunkAPI) => {
    try {
      return await jobService.updateJob(id, jobData);
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

// Delete job
export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (id, thunkAPI) => {
    try {
      await jobService.deleteJob(id);
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

// Get dashboard stats
export const getDashboardStats = createAsyncThunk(
  'jobs/getDashboardStats',
  async (_, thunkAPI) => {
    try {
      return await jobService.getDashboardStats();
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

export const jobSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    resetJobState: (state) => {
      state.success = false;
      state.error = null;
      state.loading = false;
    },
    clearJobData: (state) => {
      state.job = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get Jobs
      .addCase(getJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.success = true;
        if (action.payload.count !== undefined) {
          state.totalJobs = action.payload.count;
        }
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Get Job By ID
      .addCase(getJobById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.loading = false;
        state.job = action.payload.data;
        state.success = true;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Create Job
      .addCase(createJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs.push(action.payload.data);
        state.success = true;
      })
      .addCase(createJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Update Job
      .addCase(updateJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.map(job => 
          job._id === action.payload.data._id ? action.payload.data : job
        );
        state.job = action.payload.data;
        state.success = true;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Delete Job
      .addCase(deleteJob.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
        state.success = true;
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      })
      
      // Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.loading = false;
        state.totalJobs = action.payload.data.totalJobs;
        state.statusCounts = action.payload.data.statusCounts;
        state.success = true;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.success = false;
      });
  }
});

export const { resetJobState, clearJobData } = jobSlice.actions;

export default jobSlice.reducer;
