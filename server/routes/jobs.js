const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const {
  getJobs,
  getJob,
  createJob,
  updateJob,
  deleteJob
} = require('../controllers/jobs');
const { protect } = require('../middleware/auth');

router.route('/')
  .get(protect, getJobs)
  .post(
    protect,
    [
      check('company', 'Company name is required').not().isEmpty(),
      check('title', 'Job title is required').not().isEmpty(),
      check('appliedDate', 'Applied date is required').not().isEmpty()
    ],
    createJob
  );

router.route('/:id')
  .get(protect, getJob)
  .put(protect, updateJob)
  .delete(protect, deleteJob);

module.exports = router;
