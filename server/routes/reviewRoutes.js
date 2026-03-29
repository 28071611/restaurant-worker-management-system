const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/auth');

// Public routes
router.get('/', reviewController.getReviews);
router.get('/worker/:workerId', reviewController.getWorkerReviews);

// Protected routes
router.post('/', protect, reviewController.createReview);

module.exports = router;
