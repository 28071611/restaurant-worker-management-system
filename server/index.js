const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const workerRoutes = require('./routes/workerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');
const reputationRoutes = require('./routes/reputationRoutes');
const authRoutes = require('./routes/authRoutes');
const complaintRoutes = require('./routes/complaintRoutes');

// Singleton Pattern - Database Connection
class DatabaseConnection {
  constructor() {
    if (!DatabaseConnection.instance) {
      this.connect();
      DatabaseConnection.instance = this;
    }
    return DatabaseConnection.instance;
  }

  connect() {
    const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/restaurant_management';
    mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
      .then(() => console.log('✅ MongoDB Connected'))
      .catch((err) => console.error('❌ MongoDB Connection Error:', err));
  }
}

const dbConnection = new DatabaseConnection();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files (uploads)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/workers', workerRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/reputation', reputationRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/complaints', complaintRoutes);
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date() });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

module.exports = app;
