const { Worker } = require('../models/Worker');

// Strategy Pattern - Analytics Strategies
class AnalyticsStrategy {
  calculate(workers) {
    throw new Error('Strategy method must be implemented');
  }
}

class SalaryAnalytics extends AnalyticsStrategy {
  calculate(workers) {
    if (workers.length === 0) return 0;
    
    // Lambda/Arrow Function - Reduce operation
    const totalSalary = workers.reduce((sum, worker) => sum + worker.salary, 0);
    const averageSalary = totalSalary / workers.length;
    
    // Find highest and lowest paid workers
    const sortedBySalary = [...workers].sort((a, b) => b.salary - a.salary);
    const highestPaid = sortedBySalary[0];
    const lowestPaid = sortedBySalary[sortedBySalary.length - 1];
    
    return {
      totalSalary,
      averageSalary: Math.round(averageSalary),
      highestPaid,
      lowestPaid,
      totalWorkers: workers.length
    };
  }
}

class RoleAnalytics extends AnalyticsStrategy {
  calculate(workers) {
    // Map Concept - Count workers by role
    const roleCount = workers.reduce((map, worker) => {
      map[worker.role] = (map[worker.role] || 0) + 1;
      return map;
    }, {});
    
    // Set Concept - Get unique roles
    const uniqueRoles = new Set(workers.map(w => w.role));
    
    return {
      roleCount,
      totalRoles: uniqueRoles.size,
      roles: Array.from(uniqueRoles)
    };
  }
}

class ShiftAnalytics extends AnalyticsStrategy {
  calculate(workers) {
    // Map Concept - Count workers by shift
    const shiftCount = workers.reduce((map, worker) => {
      map[worker.shift] = (map[worker.shift] || 0) + 1;
      return map;
    }, {});
    
    return shiftCount;
  }
}

// Analytics Context
class AnalyticsContext {
  constructor(strategy) {
    this.strategy = strategy;
  }
  
  setStrategy(strategy) {
    this.strategy = strategy;
  }
  
  executeStrategy(workers) {
    return this.strategy.calculate(workers);
  }
}

// Get Dashboard Analytics
exports.getDashboardAnalytics = async (req, res) => {
  try {
    const workers = await Worker.find();
    
    // Use Strategy Pattern for different analytics
    const analyticsContext = new AnalyticsContext(new SalaryAnalytics());
    const salaryData = analyticsContext.executeStrategy(workers);
    
    analyticsContext.setStrategy(new RoleAnalytics());
    const roleData = analyticsContext.executeStrategy(workers);
    
    analyticsContext.setStrategy(new ShiftAnalytics());
    const shiftData = analyticsContext.executeStrategy(workers);
    
    // Additional analytics using Lambda/Arrow Functions
    const activeWorkers = workers.filter(w => w.status === 'Active').length;
    const recentWorkers = workers.filter(w => {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return new Date(w.joinDate) >= thirtyDaysAgo;
    }).length;
    
    res.json({
      success: true,
      data: {
        overview: {
          totalWorkers: workers.length,
          activeWorkers,
          recentWorkers
        },
        salary: salaryData,
        roles: roleData,
        shifts: shiftData,
        // Collection concepts demonstration
        collections: {
          list: workers.length, // ArrayList equivalent
          set: roleData.totalRoles, // Set equivalent
          map: Object.keys(roleData.roleCount).length // Map equivalent
        }
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get Top Performers
exports.getTopPerformers = async (req, res) => {
  try {
    const workers = await Worker.find();
    
    // Sort by salary (Comparator Pattern)
    const topEarners = [...workers]
      .sort((a, b) => b.salary - a.salary)
      .slice(0, 5);
    
    // Group by role and find top in each role
    const workersByRole = workers.reduce((map, worker) => {
      if (!map[worker.role]) {
        map[worker.role] = [];
      }
      map[worker.role].push(worker);
      return map;
    }, {});
    
    const topByRole = Object.keys(workersByRole).map(role => {
      const topInRole = workersByRole[role]
        .sort((a, b) => b.salary - a.salary)[0];
      return topInRole;
    });
    
    res.json({
      success: true,
      data: {
        topEarners,
        topByRole
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
