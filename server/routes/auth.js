const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  register,
  login,
  getMe,
  logout
} = require('../controllers/auth');
const {
  registerAdmin,
  generateAdminInvite
} = require('../controllers/adminAuth');
const { protect, authorize } = require('../middleware/auth');

router.post(
  '/register',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 })
  ],
  register
);

router.post(
  '/register-admin',
  [
    check('name', 'Name is required').not().isEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
    check('inviteCode', 'Invite code is required').not().isEmpty()
  ],
  registerAdmin
);

router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists()
  ],
  login
);

router.get('/me', protect, getMe);
// Allow logout to be called without authentication - it's still safe
router.get('/logout', logout);
router.get('/admin-invite', protect, authorize('admin'), generateAdminInvite);

module.exports = router;
