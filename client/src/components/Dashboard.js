import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees, formatAverageSalary, formatTotalPayroll } from '../utils/currencyUtils';
import { Users, DollarSign, Clock, TrendingUp, UserPlus } from 'lucide-react';

const Dashboard = () => {
  const { workers, getUniqueRoles, getWorkersByRole, getAverageSalary } = React.useContext(WorkerContext);
  const [analytics, setAnalytics] = useState(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/analytics/dashboard');
      const data = await response.json();
      setAnalytics(data.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="stat-card hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {trend && (
            <p className={`text-sm mt-1 ${trend > 0 ? 'text-green-600' : 'text-red-600'}`}>
              {trend > 0 ? '+' : ''}{trend}% from last month
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const RoleCard = ({ role, count, color }) => (
    <div className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <ChefHat className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="font-medium text-gray-900">{role}</p>
          <p className="text-sm text-gray-500">{count} workers</p>
        </div>
      </div>
      <div className="text-right">
        <p className="text-lg font-semibold text-gray-900">
          {workers.length > 0 ? Math.round((count / workers.length) * 100) : 0}%
        </p>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-1">Welcome to Restaurant Worker Management System</p>
        </div>
        <Link to="/add-worker" className="btn-primary flex items-center space-x-2">
          <UserPlus className="h-4 w-4" />
          <span>Add Worker</span>
        </Link>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={workers.length}
          icon={Users}
          color="bg-blue-500"
          trend={12}
        />
        <StatCard
          title="Average Salary"
          value={formatAverageSalary(getAverageSalary())}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="Per month"
        />
        <StatCard
          title="Active Workers"
          value={analytics?.overview?.activeWorkers || workers.length}
          icon={TrendingUp}
          color="bg-purple-500"
          trend={5}
        />
        <StatCard
          title="New Hires"
          value={analytics?.overview?.recentWorkers || 0}
          icon={Clock}
          color="bg-orange-500"
          trend={15}
        />
      </div>

      {/* Role Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Role Distribution</h2>
          <div className="space-y-3">
            {getUniqueRoles().map((role) => {
              const workersByRole = getWorkersByRole();
              const count = workersByRole[role]?.length || 0;
              
              const roleColors = {
                'Chef': 'bg-red-500',
                'Waiter': 'bg-blue-500',
                'Cleaner': 'bg-green-500',
                'Manager': 'bg-purple-500',
                'Cashier': 'bg-yellow-500'
              };

              return (
                <RoleCard
                  key={role}
                  role={role}
                  count={count}
                  color={roleColors[role] || 'bg-gray-500'}
                />
              );
            })}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              to="/add-worker"
              className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg border border-blue-200 hover:shadow-md transition-shadow"
            >
              <UserPlus className="h-8 w-8 text-blue-600 mb-2" />
              <p className="font-medium text-gray-900">Add Worker</p>
              <p className="text-sm text-gray-600">Register new employee</p>
            </Link>
            
            <Link
              to="/workers"
              className="p-4 bg-gradient-to-r from-green-50 to-green-100 rounded-lg border border-green-200 hover:shadow-md transition-shadow"
            >
              <Users className="h-8 w-8 text-green-600 mb-2" />
              <p className="font-medium text-gray-900">View Workers</p>
              <p className="text-sm text-gray-600">Manage employees</p>
            </Link>
            
            <Link
              to="/analytics"
              className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg border border-purple-200 hover:shadow-md transition-shadow"
            >
              <TrendingUp className="h-8 w-8 text-purple-600 mb-2" />
              <p className="font-medium text-gray-900">Analytics</p>
              <p className="text-sm text-gray-600">View insights</p>
            </Link>
            
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl p-6 border border-gray-200 shadow-sm">
              <h4 className="font-medium text-gray-900 mb-2">Payroll Overview</h4>
              <p className="text-sm text-gray-600 mb-4">
                {formatTotalPayroll(workers.reduce((sum, w) => sum + w.salary, 0))} per month
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Workers */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Workers</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Salary</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Shift</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody>
              {workers.slice(0, 5).map((worker) => (
                <tr key={worker._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-700">
                          {worker.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <span className="font-medium text-gray-900">{worker.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                      {worker.role}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900">{formatIndianRupees(worker.salary)}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                      {worker.shift}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-sm ${
                      worker.status === 'Active' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {worker.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {workers.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              No workers found. Add your first worker to get started!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
