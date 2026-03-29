const mongoose = require('mongoose');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // Regex Validation for Name
    match: /^[A-Za-z ]{3,}$/
  },
  role: {
    type: String,
    required: true,
    enum: ['Chef', 'Waiter', 'Cleaner', 'Manager', 'Cashier']
  },
  salary: {
    type: Number,
    required: true,
    min: 1000
  },
  shift: {
    type: String,
    required: true,
    enum: ['Morning', 'Evening', 'Night']
  },
  phone: {
    type: String,
    required: true,
    // Regex Validation for Phone
    match: /^[0-9]{10}$/
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Active', 'On Leave', 'Inactive'],
    default: 'Active'
  }
}, {
  timestamps: true
});

// Factory Pattern - Create Worker
class WorkerFactory {
  static createWorker(data) {
    return new Worker({
      name: data.name,
      role: data.role,
      salary: data.salary,
      shift: data.shift,
      phone: data.phone
    });
  }
}

const Worker = mongoose.model('Worker', workerSchema);

module.exports = { Worker, WorkerFactory };
