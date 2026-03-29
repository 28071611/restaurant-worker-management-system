const express = require('express');
const router = express.Router();
const {
  addRating,
  getWorkerRatings,
  calculateWorkerReputation,
  getReputationRanking,
  selectEmployeeOfMonth,
  getEmployeeOfMonth
} = require('../controllers/reputationController');
const { authenticate, adminOrCustomer, adminOnly } = require('../middleware/auth');

// MVC Pattern - Reputation Routes
router.post('/ratings', authenticate, adminOrCustomer, addRating);
router.get('/ratings/:workerId', getWorkerRatings);
router.get('/reputation/:workerId', calculateWorkerReputation);
router.get('/ranking', getReputationRanking);
router.post('/employee-of-month/select', authenticate, adminOnly, selectEmployeeOfMonth);
router.get('/employee-of-month', getEmployeeOfMonth);

module.exports = router;
