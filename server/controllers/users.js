const User = require('../models/User');
const Job = require('../models/Job');

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res, next) => {
  try {
    const { name, email } = req.body;

    const fieldsToUpdate = {
      name,
      email
    };

    // Update password if provided
    if (req.body.password) {
      // Password will be encrypted automatically via the User model pre-save hook
      fieldsToUpdate.password = req.body.password;
    }

    const user = await User.findByIdAndUpdate(
      req.user.id,
      fieldsToUpdate,
      {
        new: true,
        runValidators: true
      }
    );

    res.status(200).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get user dashboard stats
// @route   GET /api/users/dashboard
// @access  Private
exports.getDashboardStats = async (req, res, next) => {
  try {
    // Get count of jobs by status
    const statusCounts = await Job.aggregate([
      { $match: { user: req.user._id } },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    // Transform to key-value pairs
    const statusCountObj = statusCounts.reduce((acc, curr) => {
      acc[curr._id] = curr.count;
      return acc;
    }, {});

    // Get recent jobs (last 5)
    const recentJobs = await Job.find({ user: req.user.id })
      .sort({ appliedDate: -1 })
      .limit(5);

    // Get upcoming interviews (jobs with status Interview)
    const upcomingInterviews = await Job.find({
      user: req.user.id,
      status: 'Interview'
    }).sort({ updatedAt: -1 });

    // Total job count
    const totalJobs = await Job.countDocuments({ user: req.user.id });

    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        statusCounts: statusCountObj,
        recentJobs,
        upcomingInterviews
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Get all users - Admin only
// @route   GET /api/users
// @access  Private/Admin
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      count: users.length,
      data: users
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};

// @desc    Create a new admin user (Admin only)
// @route   POST /api/users/admin
// @access  Private/Admin
exports.createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({
        success: false,
        error: 'User already exists'
      });
    }

    // Create admin user
    user = await User.create({
      name,
      email,
      password,
      role: 'admin'
    });

    res.status(201).json({
      success: true,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({
      success: false,
      error: 'Server Error'
    });
  }
};
