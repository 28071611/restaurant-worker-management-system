const jwt = require('jsonwebtoken');
const { User, UserFactory } = require('../models/User');
const { Worker } = require('../models/Worker');

// Singleton Pattern - JWT Token Manager
class TokenManager {
  constructor() {
    if (!TokenManager.instance) {
      this.secret = process.env.JWT_SECRET || 'fallback_secret';
      TokenManager.instance = this;
    }
    return TokenManager.instance;
  }

  generateToken(payload) {
    return jwt.sign(payload, this.secret, { expiresIn: '24h' });
  }

  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }
}

const tokenManager = new TokenManager();

// Register User
exports.register = async (req, res) => {
  try {
    const { name, email, password, phone, role = 'customer' } = req.body;

    // Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // Create user using Factory Pattern
    let user;
    if (role === 'admin') {
      user = UserFactory.createAdmin({ name, email, password, phone });
    } else {
      user = UserFactory.createCustomer({ name, email, password, phone });
    }

    await user.save();

    // Generate token
    const token = tokenManager.generateToken({
      id: user._id,
      email: user.email,
      role: user.role
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          phone: user.phone
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required'
      });
    }

    // Try to find user in User collection
    let user = await User.findOne({ email, isActive: true });
    if (user) {
      // Check password
      const isMatch = await user.comparePassword(password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: 'Invalid credentials'
        });
      }
      // Update login info
      await user.updateLoginInfo();
      // Generate token
      const token = tokenManager.generateToken({
        id: user._id,
        email: user.email,
        role: user.role
      });
      return res.json({
        success: true,
        message: 'Login successful',
        data: {
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            lastLogin: user.lastLogin,
            loginCount: user.loginCount
          },
          token
        }
      });
    }

    // If not found in User, try Worker collection
    const worker = await Worker.findOne({ email });
    if (!worker) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    // Check password (if set)
    if (!worker.password) {
      return res.status(401).json({
        success: false,
        message: 'Worker account does not have a password set.'
      });
    }
    const isWorkerMatch = await worker.comparePassword(password);
    if (!isWorkerMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }
    // Generate token for worker
    const token = tokenManager.generateToken({
      id: worker._id,
      email: worker.email,
      role: 'worker'
    });
    return res.json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: worker._id,
          name: worker.name,
          email: worker.email,
          role: 'worker',
          phone: worker.phone
        },
        token
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Current User
exports.getCurrentUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update fields
    if (name) user.name = name;
    if (phone) user.phone = phone;

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Change Password
exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user.id;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required'
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: 'Current password is incorrect'
      });
    }

    // Update password
    user.password = newPassword;
    await user.save();

    res.json({
      success: true,
      message: 'Password changed successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Logout User (Client-side token removal)
exports.logout = async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
