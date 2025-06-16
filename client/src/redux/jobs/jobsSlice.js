import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import jobService from '../../services/jobService';

export const getJobs = createAsyncThunk(
  'jobs/getAll',
  async (params, thunkAPI) => {
    try {
      return await jobService.getJobs(params);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch jobs'
      );
    }
  }
);

export const getJobById = createAsyncThunk(
  'jobs/getById',
  async (jobId, thunkAPI) => {
    try {
      return await jobService.getJobById(jobId);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch job'
      );
    }
  }
);

export const createJob = createAsyncThunk(
  'jobs/create',
  async (jobData, thunkAPI) => {
    try {
      return await jobService.createJob(jobData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to create job'
      );
    }
  }
);

export const updateJob = createAsyncThunk(
  'jobs/update',
  async ({ jobId, jobData }, thunkAPI) => {
    try {
      return await jobService.updateJob(jobId, jobData);
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to update job'
      );
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/delete',
  async (jobId, thunkAPI) => {
    try {
      await jobService.deleteJob(jobId);
      return jobId;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to delete job'
      );
    }
  }
);

export const getDashboardStats = createAsyncThunk(
  'jobs/getDashboardStats',
  async (_, thunkAPI) => {
    try {
      return await jobService.getDashboardStats();
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Failed to fetch dashboard stats'
      );
    }
  }
);

const initialState = {
  jobs: [],
  job: null,
  totalJobs: 0,
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
  filters: {
    status: '',
    sort: '-appliedDate',
    page: 1,
    limit: 10
  },
  stats: null
};

const jobsSlice = createSlice({
  name: 'jobs',
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetJobState: (state) => {
      state.job = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get all jobs
      .addCase(getJobs.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobs.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = action.payload.data;
        state.totalJobs = action.payload.total;
      })
      .addCase(getJobs.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Get job by ID
      .addCase(getJobById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getJobById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.job = action.payload.data;
      })
      .addCase(getJobById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Create job
      .addCase(createJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(createJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs.unshift(action.payload.data);
      })
      .addCase(createJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Update job
      .addCase(updateJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(updateJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        const index = state.jobs.findIndex(job => job._id === action.payload.data._id);
        if (index !== -1) {
          state.jobs[index] = action.payload.data;
        }
        state.job = action.payload.data;
      })
      .addCase(updateJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Delete job
      .addCase(deleteJob.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.jobs = state.jobs.filter(job => job._id !== action.payload);
      })
      .addCase(deleteJob.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      // Get dashboard stats
      .addCase(getDashboardStats.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.stats = action.payload.data;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  }
});

export const { setFilters, resetJobState } = jobsSlice.actions;

export default jobsSlice.reducer;
