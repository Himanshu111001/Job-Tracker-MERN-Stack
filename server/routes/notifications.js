const express = require('express');
const router = express.Router();
const {
  getNotifications,
  markRead,
  markAllRead,
  deleteNotification
} = require('../controllers/notifications');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getNotifications)
  .put(protect, markAllRead);

router.route('/:id')
  .put(protect, markRead)
  .delete(protect, deleteNotification);

module.exports = router;
