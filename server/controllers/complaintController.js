const Complaint = require('../models/Complaint');
const { Worker } = require('../models/Worker');

// File Complaint
exports.fileComplaint = async (req, res) => {
  try {
    const { workerId, complaint, severity, clientName, clientEmail } = req.body;

    // Validate input
    if (!complaint || !complaint.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Complaint description is required'
      });
    }

    if (complaint.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Complaint must be at least 10 characters long'
      });
    }

    // Validate worker if provided
    if (workerId) {
      const worker = await Worker.findById(workerId);
      if (!worker) {
        return res.status(404).json({
          success: false,
          message: 'Worker not found'
        });
      }
    }

    const newComplaint = new Complaint({
      workerId: workerId || null,
      complaint: complaint.trim(),
      severity,
      clientName,
      clientEmail
    });

    await newComplaint.save();

    res.status(201).json({
      success: true,
      message: 'Complaint filed successfully',
      data: newComplaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get All Complaints (Admin only)
exports.getAllComplaints = async (req, res) => {
  try {
    const { status, severity, page = 1, limit = 10 } = req.query;
    
    // Build filter
    const filter = {};
    if (status) filter.status = status;
    if (severity) filter.severity = severity;

    const complaints = await Complaint.find(filter)
      .sort({ date: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .populate('workerId', 'name role');

    const total = await Complaint.countDocuments(filter);

    res.json({
      success: true,
      data: {
        complaints,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit)
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

// Get Customer Complaints
exports.getCustomerComplaints = async (req, res) => {
  try {
    const { clientEmail } = req.query;
    
    const filter = clientEmail ? { clientEmail } : {};
    
    const complaints = await Complaint.find(filter)
      .sort({ date: -1 })
      .limit(50)
      .populate('workerId', 'name role');

    res.json({
      success: true,
      data: complaints
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Update Complaint Status (Admin only)
exports.updateComplaintStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, resolution } = req.body;

    const complaint = await Complaint.findById(id);
    if (!complaint) {
      return res.status(404).json({
        success: false,
        message: 'Complaint not found'
      });
    }

    complaint.status = status;
    
    if (status === 'Resolved' && resolution) {
      complaint.resolution = resolution.trim();
      complaint.resolvedDate = new Date();
    }

    await complaint.save();

    res.json({
      success: true,
      message: 'Complaint status updated successfully',
      data: complaint
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// Get Complaint Statistics (Admin only)
exports.getComplaintStats = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments();
    
    const complaintsByStatus = await Complaint.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const complaintsBySeverity = await Complaint.aggregate([
      {
        $group: {
          _id: '$severity',
          count: { $sum: 1 }
        }
      }
    ]);

    const recentComplaints = await Complaint.countDocuments({
      date: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    });

    const resolvedComplaints = await Complaint.countDocuments({ status: 'Resolved' });

    res.json({
      success: true,
      data: {
        totalComplaints,
        resolvedComplaints,
        pendingComplaints: totalComplaints - resolvedComplaints,
        recentComplaints,
        complaintsByStatus,
        complaintsBySeverity
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};
