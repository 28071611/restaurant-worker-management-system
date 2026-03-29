const { Worker } = require('../models/Worker');
const Rating = require('../models/Rating');
const Attendance = require('../models/Attendance');
const Complaint = require('../models/Complaint');
const Workload = require('../models/Workload');
const EmployeeOfMonth = require('../models/EmployeeOfMonth');

// Strategy Pattern - Reputation Calculation Strategies
class ReputationStrategy {
  calculate(workerData) {
    throw new Error('Strategy method must be implemented');
  }
}

class StandardReputationStrategy extends ReputationStrategy {
  calculate(workerData) {
    // Multi-factor reputation score formula
    const {
      avgRating = 0,
      attendancePercentage = 0,
      experienceMonths = 0,
      avgWorkloadScore = 0,
      totalComplaints = 0,
      totalRatings = 0
    } = workerData;

    // Reputation Score Formula
    const reputationScore = 
      (avgRating * 0.5) +                    // 50% weight to rating
      (attendancePercentage * 0.2) +         // 20% weight to attendance
      (Math.min(experienceMonths / 12, 1) * 0.1) + // 10% weight to experience (max 1 year)
      (avgWorkloadScore / 100 * 0.1) +       // 10% weight to workload
      (Math.max(0, 1 - totalComplaints / 10) * 0.1); // 10% weight to complaints (inverse)

    return Math.round(reputationScore * 100) / 100; // Round to 2 decimal places
  }
}

class AdvancedReputationStrategy extends ReputationStrategy {
  calculate(workerData) {
    const {
      avgRating = 0,
      attendancePercentage = 0,
      experienceMonths = 0,
      avgWorkloadScore = 0,
      totalComplaints = 0,
      totalRatings = 0,
      recentPerformance = []
    } = workerData;

    // Advanced formula with recent performance weighting
    const baseScore = 
      (avgRating * 0.4) +                    // 40% rating
      (attendancePercentage * 0.2) +         // 20% attendance
      (Math.min(experienceMonths / 12, 1) * 0.1) + // 10% experience
      (avgWorkloadScore / 100 * 0.2) +       // 20% workload
      (Math.max(0, 1 - totalComplaints / 10) * 0.1); // 10% complaints

    // Bonus for recent good performance
    const recentBonus = recentPerformance.length > 0 
      ? recentPerformance.reduce((sum, perf) => sum + perf, 0) / recentPerformance.length * 0.1
      : 0;

    return Math.round((baseScore + recentBonus) * 100) / 100;
  }
}

// Reputation Calculator Context
class ReputationCalculator {
  constructor(strategy = new StandardReputationStrategy()) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  calculateReputation(workerData) {
    return this.strategy.calculate(workerData);
  }
}

// Add Rating
exports.addRating = async (req, res) => {
  try {
    const { workerId, rating, feedback, clientName, serviceType } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5'
      });
    }

    // Validate worker exists
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    const newRating = new Rating({
      workerId,
      rating,
      feedback,
      clientName,
      serviceType
    });

    await newRating.save();

    res.status(201).json({
      success: true,
      message: 'Rating added successfully',
      data: newRating
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Worker Ratings
exports.getWorkerRatings = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { limit = 10, page = 1 } = req.query;

    const ratings = await Rating.find({ workerId })
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('workerId', 'name role');

    const total = await Rating.countDocuments({ workerId });

    // Calculate average rating using Lambda/Reduce
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    res.json({
      success: true,
      data: {
        ratings,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
        },
        stats: {
          averageRating: Math.round(avgRating * 100) / 100,
          totalRatings: total
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Calculate Worker Reputation Score
exports.calculateWorkerReputation = async (req, res) => {
  try {
    const { workerId } = req.params;
    const { month, year } = req.query;

    // Get worker
    const worker = await Worker.findById(workerId);
    if (!worker) {
      return res.status(404).json({
        success: false,
        message: 'Worker not found'
      });
    }

    // Calculate experience in months
    const experienceMonths = Math.floor((Date.now() - worker.joinDate) / (1000 * 60 * 60 * 24 * 30));

    // Get ratings data
    const ratings = await Rating.find({ workerId });
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;

    // Get attendance data for the month
    const startDate = new Date(year, month - 1, 1);
    const endDate = new Date(year, month, 0);
    
    const attendance = await Attendance.find({
      workerId,
      date: { $gte: startDate, $lte: endDate }
    });

    const workingDays = attendance.length;
    const presentDays = attendance.filter(a => a.status === 'Present').length;
    const attendancePercentage = workingDays > 0 ? (presentDays / workingDays) * 100 : 0;

    // Get complaints data
    const complaints = await Complaint.find({ workerId });
    const totalComplaints = complaints.length;

    // Get workload data
    const workload = await Workload.find({
      workerId,
      date: { $gte: startDate, $lte: endDate }
    });

    const avgWorkloadScore = workload.length > 0
      ? workload.reduce((sum, w) => sum + w.performanceScore, 0) / workload.length
      : 0;

    // Prepare worker data for reputation calculation
    const workerData = {
      avgRating,
      attendancePercentage,
      experienceMonths,
      avgWorkloadScore,
      totalComplaints,
      totalRatings: ratings.length
    };

    // Calculate reputation using strategy pattern
    const calculator = new ReputationCalculator();
    const reputationScore = calculator.calculateReputation(workerData);

    res.json({
      success: true,
      data: {
        worker: {
          id: worker._id,
          name: worker.name,
          role: worker.role
        },
        reputationScore,
        breakdown: {
          avgRating: Math.round(avgRating * 100) / 100,
          attendancePercentage: Math.round(attendancePercentage),
          experienceMonths,
          avgWorkloadScore: Math.round(avgWorkloadScore),
          totalComplaints,
          totalRatings: ratings.length
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Workers Reputation Ranking
exports.getReputationRanking = async (req, res) => {
  try {
    const workers = await Worker.find();
    const calculator = new ReputationCalculator();
    
    const reputationData = await Promise.all(
      workers.map(async (worker) => {
        const experienceMonths = Math.floor((Date.now() - worker.joinDate) / (1000 * 60 * 60 * 24 * 30));
        
        // Get ratings
        const ratings = await Rating.find({ workerId: worker._id });
        const avgRating = ratings.length > 0
          ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
          : 0;

        // Get complaints
        const complaints = await Complaint.find({ workerId: worker._id });
        const totalComplaints = complaints.length;

        // Get recent workload
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
        const workload = await Workload.find({
          workerId: worker._id,
          date: { $gte: thirtyDaysAgo }
        });
        const avgWorkloadScore = workload.length > 0
          ? workload.reduce((sum, w) => sum + w.performanceScore, 0) / workload.length
          : 0;

        const workerData = {
          avgRating,
          attendancePercentage: 85, // Default for demo, calculate from attendance
          experienceMonths,
          avgWorkloadScore,
          totalComplaints,
          totalRatings: ratings.length
        };

        const reputationScore = calculator.calculateReputation(workerData);

        return {
          workerId: worker._id,
          name: worker.name,
          role: worker.role,
          reputationScore,
          avgRating: Math.round(avgRating * 100) / 100,
          totalRatings: ratings.length,
          totalComplaints
        };
      })
    );

    // Sort by reputation score (Comparator Pattern)
    reputationData.sort((a, b) => b.reputationScore - a.reputationScore);

    res.json({
      success: true,
      data: reputationData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Select Employee of the Month
exports.selectEmployeeOfMonth = async (req, res) => {
  try {
    const { month, year } = req.body;
    
    // Check if already selected for this month
    const existing = await EmployeeOfMonth.findOne({ month, year });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'Employee of the month already selected for this period'
      });
    }

    // Get all workers reputation for the month
    const workers = await Worker.find();
    const calculator = new ReputationCalculator();
    
    let bestWorker = null;
    let highestScore = 0;

    for (const worker of workers) {
      // Calculate reputation for this worker
      const experienceMonths = Math.floor((Date.now() - worker.joinDate) / (1000 * 60 * 60 * 24 * 30));
      
      const ratings = await Rating.find({ workerId: worker._id });
      const avgRating = ratings.length > 0
        ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
        : 0;

      const complaints = await Complaint.find({ workerId: worker._id });
      const totalComplaints = complaints.length;

      const startDate = new Date(year, month - 1, 1);
      const endDate = new Date(year, month, 0);
      
      const workload = await Workload.find({
        workerId: worker._id,
        date: { $gte: startDate, $lte: endDate }
      });
      const avgWorkloadScore = workload.length > 0
        ? workload.reduce((sum, w) => sum + w.performanceScore, 0) / workload.length
        : 0;

      const attendance = await Attendance.find({
        workerId: worker._id,
        date: { $gte: startDate, $lte: endDate }
      });
      const workingDays = attendance.length;
      const presentDays = attendance.filter(a => a.status === 'Present').length;
      const attendancePercentage = workingDays > 0 ? (presentDays / workingDays) * 100 : 0;

      // Minimum 5 ratings requirement
      if (ratings.length < 5) continue;

      const workerData = {
        avgRating,
        attendancePercentage,
        experienceMonths,
        avgWorkloadScore,
        totalComplaints,
        totalRatings: ratings.length
      };

      const reputationScore = calculator.calculateReputation(workerData);

      if (reputationScore > highestScore) {
        highestScore = reputationScore;
        bestWorker = {
          workerId: worker._id,
          reputationScore,
          avgRating,
          attendancePercentage,
          totalComplaints,
          avgWorkloadScore
        };
      }
    }

    if (!bestWorker) {
      return res.status(404).json({
        success: false,
        message: 'No eligible worker found (minimum 5 ratings required)'
      });
    }

    // Calculate bonus amount (example: 5% of average salary)
    const workerDetails = await Worker.findById(bestWorker.workerId);
    const bonusAmount = Math.round(workerDetails.salary * 0.05);

    // Save employee of the month
    const employeeOfMonth = new EmployeeOfMonth({
      workerId: bestWorker.workerId,
      month,
      year,
      reputationScore: bestWorker.reputationScore,
      avgRating: bestWorker.avgRating,
      attendancePercentage: bestWorker.attendancePercentage,
      totalComplaints: bestWorker.totalComplaints,
      workloadScore: bestWorker.avgWorkloadScore,
      bonusAmount
    });

    await employeeOfMonth.save();

    res.json({
      success: true,
      message: 'Employee of the month selected successfully',
      data: {
        employee: await EmployeeOfMonth.findById(employeeOfMonth._id).populate('workerId', 'name role salary'),
        bonusAmount
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Employee of the Month
exports.getEmployeeOfMonth = async (req, res) => {
  try {
    const { month, year } = req.query;
    
    const employee = await EmployeeOfMonth.findOne({ month, year })
      .populate('workerId', 'name role salary phone');

    if (!employee) {
      return res.status(404).json({
        success: false,
        message: 'Employee of the month not found for this period'
      });
    }

    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
