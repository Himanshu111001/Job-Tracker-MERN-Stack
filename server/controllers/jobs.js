const Job = require('../models/Job');
const Notification = require('../models/Notification');
const { validationResult } = require('express-validator');

// @desc    Get all jobs for a user
// @route   GET /api/jobs
// @access  Private
exports.getJobs = async (req, res, next) => {
  try {
    let query;
    
    // Build query
    if (req.user.role === 'admin') {
      // If admin, can see all jobs
      query = Job.find();
    } else {
      // If applicant, can only see their jobs
      query = Job.find({ user: req.user.id });
    }

    // Filter by status if provided
    if (req.query.status) {
      query = query.where('status').equals(req.query.status);
    }

    // Sort by appliedDate (default is descending, newest first)
    const sortDirection = req.query.sort === 'asc' ? 1 : -1;
    query = query.sort({ appliedDate: sortDirection });

    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Job.countDocuments(query);

    query = query.skip(startIndex).limit(limit);

    // Execute query
    const jobs = await query;

    // Pagination result
    const pagination = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }

    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }

    res.status(200).json({
      success: true,
      count: jobs.length,
      pagination,
      data: jobs
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get single job
// @route   GET /api/jobs/:id
// @access  Private
exports.getJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Make sure user owns the job or is admin
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to view this job'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create new job
// @route   POST /api/jobs
// @access  Private
exports.createJob = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Add user to req.body
    req.body.user = req.user.id;

    const job = await Job.create(req.body);

    // Create notification for new job
    await Notification.create({
      type: 'new_job',
      title: 'New Job Application',
      message: `You've added a new application for ${job.title} at ${job.company}`,
      user: req.user.id,
      job: job._id
    });

    // Emit socket event for real-time notification
    if (req.io) {
      req.io.to(req.user.id).emit('notification', {
        type: 'new_job',
        title: 'New Job Application',
        message: `You've added a new application for ${job.title} at ${job.company}`
      });
    }

    res.status(201).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Update job
// @route   PUT /api/jobs/:id
// @access  Private
exports.updateJob = async (req, res, next) => {
  try {
    let job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Make sure user owns the job or is admin
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to update this job'
      });
    }

    // Check for status change to create notification
    const statusChanged = req.body.status && req.body.status !== job.status;
    const oldStatus = job.status;

    job = await Job.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    // If status changed, create notification
    if (statusChanged) {
      const notification = await Notification.create({
        type: 'status_change',
        title: 'Application Status Changed',
        message: `Your application for ${job.title} at ${job.company} has changed from ${oldStatus} to ${job.status}`,
        user: job.user,
        job: job._id
      });

      // Emit socket event for real-time notification
      if (req.io) {
        req.io.to(job.user.toString()).emit('notification', {
          type: 'status_change',
          title: 'Application Status Changed',
          message: `Your application for ${job.title} at ${job.company} has changed from ${oldStatus} to ${job.status}`
        });
      }
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Delete job
// @route   DELETE /api/jobs/:id
// @access  Private
exports.deleteJob = async (req, res, next) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({
        success: false,
        error: 'Job not found'
      });
    }

    // Make sure user owns the job or is admin
    if (job.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Not authorized to delete this job'
      });
    }

    await job.deleteOne();

    // Also delete any notifications associated with this job
    await Notification.deleteMany({ job: req.params.id });

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
