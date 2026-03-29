const Review = require('../models/Review');
const { Worker } = require('../models/Worker');

// Get all reviews
exports.getReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ status: 'Approved' })
            .populate('customer', 'name')
            .populate('worker', 'name role')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Create a review
exports.createReview = async (req, res) => {
    try {
        const { workerId, rating, comment } = req.body;
        const customerId = req.user.id; // From auth middleware

        if (!rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Rating and comment are required'
            });
        }

        const review = new Review({
            customer: customerId,
            worker: workerId || undefined,
            rating,
            comment
        });

        await review.save();

        res.status(201).json({
            success: true,
            message: 'Review submitted successfully',
            data: review
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get reviews for a specific worker
exports.getWorkerReviews = async (req, res) => {
    try {
        const { workerId } = req.params;
        const reviews = await Review.find({ worker: workerId, status: 'Approved' })
            .populate('customer', 'name')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
