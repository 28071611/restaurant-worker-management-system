const express = require('express');
const router = express.Router();
const {
  fileComplaint,
  getAllComplaints,
  getCustomerComplaints,
  updateComplaintStatus,
  getComplaintStats
} = require('../controllers/complaintController');
const { authenticate, adminOnly } = require('../middleware/auth');

// Public routes (for customers)
router.post('/', authenticate, fileComplaint);
router.get('/customer', getCustomerComplaints);

// Admin only routes
router.get('/', authenticate, adminOnly, getAllComplaints);
router.put('/:id', authenticate, adminOnly, updateComplaintStatus);
router.get('/stats', authenticate, adminOnly, getComplaintStats);

module.exports = router;
