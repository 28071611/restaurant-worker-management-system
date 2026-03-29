const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getTopPerformers
} = require('../controllers/analyticsController');

// MVC Pattern - Analytics Routes
router.get('/dashboard', getDashboardAnalytics);
router.get('/top-performers', getTopPerformers);

module.exports = router;
