const { Worker, WorkerFactory } = require('../models/Worker');

// Iterator Pattern - Worker Iterator
class WorkerIterator {
  constructor(workers) {
    this.workers = workers;
    this.index = 0;
  }

  hasNext() {
    return this.index < this.workers.length;
  }

  next() {
    return this.hasNext() ? this.workers[this.index++] : null;
  }

  reset() {
    this.index = 0;
  }
}

// Add Worker (Factory Pattern)
exports.addWorker = async (req, res) => {
  try {
    const worker = WorkerFactory.createWorker(req.body);
    await worker.save();
    res.status(201).json({ 
      success: true, 
      message: 'Worker added successfully',
      data: worker 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// Get All Workers with Collections Concepts
exports.getWorkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    
    // Set Concept - Get Unique Roles
    const uniqueRoles = new Set(workers.map(w => w.role));
    
    // Map Concept - Group Workers by Role
    const workersByRole = workers.reduce((map, worker) => {
      if (!map[worker.role]) {
        map[worker.role] = [];
      }
      map[worker.role].push(worker);
      return map;
    }, {});

    // Iterator Pattern
    const iterator = new WorkerIterator(workers);
    
    res.json({
      success: true,
      data: workers,
      analytics: {
        totalWorkers: workers.length,
        uniqueRoles: Array.from(uniqueRoles),
        workersByRole,
        // Iterator demonstration
        firstWorker: iterator.next(),
        hasNext: iterator.hasNext()
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Search Workers (Streams Concept)
exports.searchWorkers = async (req, res) => {
  try {
    const { query } = req.query;
    
    // Lambda/Arrow Function (Filter)
    const workers = await Worker.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } }
      ]
    });

    res.json({
      success: true,
      data: workers,
      count: workers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Filter Workers by Role (Streams Concept)
exports.filterWorkers = async (req, res) => {
  try {
    const { role } = req.params;
    
    // Lambda/Arrow Function
    const workers = await Worker.find({ role });
    
    res.json({
      success: true,
      data: workers,
      count: workers.length
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Sort Workers (Comparator Pattern)
exports.sortWorkers = async (req, res) => {
  try {
    const { sortBy = 'salary', order = 'desc' } = req.query;
    
    let workers = await Worker.find();
    
    // Comparator Implementation
    workers.sort((a, b) => {
      let comparison = 0;
      
      switch(sortBy) {
        case 'salary':
          comparison = a.salary - b.salary;
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'joinDate':
          comparison = new Date(a.joinDate) - new Date(b.joinDate);
          break;
        default:
          comparison = a.salary - b.salary;
      }
      
      return order === 'asc' ? comparison : -comparison;
    });

    res.json({
      success: true,
      data: workers,
      sortedBy: sortBy,
      order
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Worker
exports.updateWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true }
    );
    
    if (!worker) {
      return res.status(404).json({ 
        success: false, 
        message: 'Worker not found' 
      });
    }

    res.json({
      success: true,
      message: 'Worker updated successfully',
      data: worker
    });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

// Delete Worker
exports.deleteWorker = async (req, res) => {
  try {
    const worker = await Worker.findByIdAndDelete(req.params.id);
    
    if (!worker) {
      return res.status(404).json({ 
        success: false, 
        message: 'Worker not found' 
      });
    }

    res.json({
      success: true,
      message: 'Worker deleted successfully',
      data: worker
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
