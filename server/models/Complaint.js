const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  complaint: {
    type: String,
    required: true,
    trim: true,
    maxlength: 500
  },
  clientName: {
    type: String,
    required: true,
    trim: true
  },
  severity: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  status: {
    type: String,
    enum: ['Pending', 'Investigating', 'Resolved', 'Dismissed'],
    default: 'Pending'
  },
  date: {
    type: Date,
    default: Date.now
  },
  resolvedDate: {
    type: Date
  },
  resolution: {
    type: String,
    trim: true,
    maxlength: 500
  }
}, {
  timestamps: true
});

// Index for faster queries
complaintSchema.index({ workerId: 1, date: -1 });

module.exports = mongoose.model('Complaint', complaintSchema);
