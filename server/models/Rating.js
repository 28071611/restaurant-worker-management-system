const mongoose = require('mongoose');

const ratingSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: 500
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  date: {
    type: Date,
    default: Date.now
  },
  serviceType: {
    type: String,
    enum: ['Dining', 'Takeaway', 'Delivery', 'Catering'],
    default: 'Dining'
  }
}, {
  timestamps: true
});

// Index for faster queries
ratingSchema.index({ workerId: 1, date: -1 });

module.exports = mongoose.model('Rating', ratingSchema);
