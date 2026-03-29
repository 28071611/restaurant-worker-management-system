const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    // Regex validation for email
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  role: {
    type: String,
    enum: ['admin', 'customer'],
    default: 'customer'
  },
  phone: {
    type: String,
    trim: true,
    // Regex validation for phone
    match: /^[0-9]{10}$/
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: {
    type: Date
  },
  loginCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Update login info
userSchema.methods.updateLoginInfo = function() {
  this.lastLogin = new Date();
  this.loginCount += 1;
  return this.save();
};

// Factory Pattern - User Creation
class UserFactory {
  static createUser(userData) {
    const user = new User(userData);
    return user;
  }
  
  static createAdmin(userData) {
    return new User({
      ...userData,
      role: 'admin'
    });
  }
  
  static createCustomer(userData) {
    return new User({
      ...userData,
      role: 'customer'
    });
  }
}

const User = mongoose.model('User', userSchema);

module.exports = { User, UserFactory };
