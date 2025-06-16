const express = require('express');
const router = express.Router();
const {
  updateProfile,
  getDashboardStats,
  getUsers
} = require('../controllers/users');
const { protect, authorize } = require('../middleware/auth');

router.put('/profile', protect, updateProfile);
router.get('/dashboard', protect, getDashboardStats);
router.get('/', protect, authorize('admin'), getUsers);

module.exports = router;
