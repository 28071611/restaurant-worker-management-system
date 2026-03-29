const mongoose = require('mongoose');

const employeeOfMonthSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  month: {
    type: String,
    required: true // Format: "2024-01"
  },
  year: {
    type: Number,
    required: true
  },
  reputationScore: {
    type: Number,
    required: true
  },
  avgRating: {
    type: Number,
    required: true
  },
  attendancePercentage: {
    type: Number,
    required: true
  },
  totalComplaints: {
    type: Number,
    default: 0
  },
  workloadScore: {
    type: Number,
    required: true
  },
  bonusAmount: {
    type: Number,
    default: 0
  },
  announcementDate: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Unique index for month-year combination
employeeOfMonthSchema.index({ month: 1, year: 1 }, { unique: true });

module.exports = mongoose.model('EmployeeOfMonth', employeeOfMonthSchema);
