const mongoose = require('mongoose');

const workloadSchema = new mongoose.Schema({
  workerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Worker',
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  tasksCompleted: {
    type: Number,
    default: 0
  },
  ordersHandled: {
    type: Number,
    default: 0
  },
  tablesServed: {
    type: Number,
    default: 0
  },
  complexity: {
    type: String,
    enum: ['Low', 'Medium', 'High'],
    default: 'Medium'
  },
  performanceScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 80
  }
}, {
  timestamps: true
});

// Index for faster queries
workloadSchema.index({ workerId: 1, date: -1 });

module.exports = mongoose.model('Workload', workloadSchema);
