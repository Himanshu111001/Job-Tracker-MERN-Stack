const User = require('../models/User');
const { validateAdminInviteCode } = require('../utils/adminInviteCode');

// @desc    Register admin user using invite code
// @route   POST /api/auth/register-admin
// @access  Public (with invite code)
exports.registerAdmin = async (req, res, next) => {
  try {
    const { name, email, password, inviteCode } = req.body;

    // Validate required fields
    if (!name || !email || !password || !inviteCode) {
      return res.status(400).json({
        success: false,
        error: 'Please provide all required fields'
      });
    }

    // Validate the invite code
    const isValidInviteCode = validateAdminInviteCode(inviteCode);
    if (!isValidInviteCode) {
      return res.status(400).json({
        success: false,
        error: 'Invalid invite code'
      });
    }

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

    // Generate token
    const token = user.getSignedJwtToken();

    res.status(201).json({
      success: true,
      token,
      user: {
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

// @desc    Generate admin invite code (Admin only)
// @route   GET /api/auth/admin-invite
// @access  Private/Admin
exports.generateAdminInvite = async (req, res, next) => {
  try {
    const { generateAdminInviteCode } = require('../utils/adminInviteCode');
    const inviteCode = generateAdminInviteCode();
    
    if (!inviteCode) {
      return res.status(500).json({
        success: false,
        error: 'Failed to generate invite code. ADMIN_INVITE_SECRET environment variable not set.'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {
        inviteCode
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
