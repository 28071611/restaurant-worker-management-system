const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const workerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    // Regex validation for name (letters and spaces only, min 3 chars)
    match: /^[A-Za-z ]{3,}$/
  },
  email: {
    type: String,
    unique: true,
    lowercase: true,
    trim: true,
    // Regex validation for email
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  phone: {
    type: String,
    required: true,
    // Regex validation for phone (exactly 10 digits)
    match: /^[0-9]{10}$/
  },
  role: {
    type: String,
    required: true,
    enum: ['Chef', 'Waiter', 'Cleaner', 'Manager', 'Cashier', 'Security']
  },
  salary: {
    type: Number,
    required: true,
    min: 5000,
    max: 100000
  },
  shift: {
    type: String,
    required: true,
    enum: ['Morning', 'Evening', 'Night', 'Full']
  },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active'
  },
  joinDate: {
    type: Date,
    default: Date.now
  },
  department: {
    type: String,
    required: true,
    enum: ['Kitchen', 'Service', 'Maintenance', 'Management', 'Billing', 'Security']
  },
  experience: {
    type: Number,
    default: 0,
    min: 0,
    max: 50
  },
  // Employee image field
  employeeImage: {
    filename: String,
    originalName: String,
    path: String,
    size: Number,
    mimetype: String,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  },
  password: {
    type: String,
    required: false, // Optional if we use User model, but let's add it for direct login
    minlength: 6
  }
}, {
  timestamps: true
});

// Index for better query performance
workerSchema.index({ email: 1 });
workerSchema.index({ phone: 1 });
workerSchema.index({ role: 1 });
workerSchema.index({ department: 1 });

// Virtual for image URL
workerSchema.virtual('imageUrl').get(function () {
  if (this.employeeImage && this.employeeImage.filename) {
    return `/uploads/${this.employeeImage.filename}`;
  }
  return null;
});

// Factory Pattern - Worker Creation
class WorkerFactory {
  static createWorker(workerData) {
    const worker = new Worker(workerData);
    return worker;
  }

  static createChef(workerData) {
    return new Worker({
      ...workerData,
      role: 'Chef',
      department: 'Kitchen'
    });
  }

  static createWaiter(workerData) {
    return new Worker({
      ...workerData,
      role: 'Waiter',
      department: 'Service'
    });
  }

  static createCleaner(workerData) {
    return new Worker({
      ...workerData,
      role: 'Cleaner',
      department: 'Maintenance'
    });
  }

  static createManager(workerData) {
    return new Worker({
      ...workerData,
      role: 'Manager',
      department: 'Management'
    });
  }

  static createCashier(workerData) {
    return new Worker({
      ...workerData,
      role: 'Cashier',
      department: 'Billing'
    });
  }

  static createSecurity(workerData) {
    return new Worker({
      ...workerData,
      role: 'Security',
      department: 'Security'
    });
  }
}

// Hash password before saving
workerSchema.pre('save', async function (next) {
  // Regular validation
  if (this.phone && !/^[0-9]{10}$/.test(this.phone)) {
    return next(new Error('Phone number must be exactly 10 digits'));
  }
  if (this.name && !/^[A-Za-z ]{3,}$/.test(this.name)) {
    return next(new Error('Name must contain only letters and spaces, minimum 3 characters'));
  }

  // Password hashing
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to update employee image
workerSchema.methods.updateEmployeeImage = function (imageData) {
  this.employeeImage = {
    filename: imageData.filename,
    originalName: imageData.originalName,
    path: imageData.path,
    size: imageData.size,
    mimetype: imageData.mimetype,
    uploadedAt: new Date()
  };
  return this.save();
};

// Method to remove employee image
workerSchema.methods.removeEmployeeImage = function () {
  const fs = require('fs');
  const path = require('path');

  if (this.employeeImage && this.employeeImage.path) {
    // Delete file from filesystem
    try {
      if (fs.existsSync(this.employeeImage.path)) {
        fs.unlinkSync(this.employeeImage.path);
      }
    } catch (error) {
      console.error('Error deleting image file:', error);
    }
  }

  // Remove image reference from database
  this.employeeImage = undefined;
  return this.save();
};

// Compare password method
workerSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

const Worker = mongoose.model('Worker', workerSchema);

module.exports = { Worker, WorkerFactory };
