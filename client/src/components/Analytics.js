import React, { useState, useEffect } from 'react';
import { WorkerContext } from '../context/WorkerContext';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Award,
  Target,
  PieChart as PieChartIcon
} from 'lucide-react';

const Analytics = () => {
  const { workers, getUniqueRoles, getWorkersByRole, getAverageSalary } = React.useContext(WorkerContext);
  const [analytics, setAnalytics] = useState(null);
  const [topPerformers, setTopPerformers] = useState(null);

  useEffect(() => {
    fetchAnalytics();
    fetchTopPerformers();
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

  const fetchTopPerformers = async () => {
    try {
      const response = await fetch('/api/analytics/top-performers');
      const data = await response.json();
      setTopPerformers(data.data);
    } catch (error) {
      console.error('Failed to fetch top performers:', error);
    }
  };

  // Prepare data for charts
  const roleData = getUniqueRoles().map(role => ({
    name: role,
    count: getWorkersByRole()[role]?.length || 0,
    avgSalary: Math.round(
      getWorkersByRole()[role]?.reduce((sum, w) => sum + w.salary, 0) / 
      (getWorkersByRole()[role]?.length || 1)
    )
  }));

  const shiftData = ['Morning', 'Evening', 'Night'].map(shift => ({
    name: shift,
    count: workers.filter(w => w.shift === shift).length
  }));

  const salaryData = workers.map(worker => ({
    name: worker.name,
    salary: worker.salary,
    role: worker.role
  })).sort((a, b) => b.salary - a.salary).slice(0, 10);

  const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="stat-card hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
        <p className="text-gray-600 mt-1">Insights and performance metrics</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={workers.length}
          icon={Users}
          color="bg-blue-500"
          subtitle="Active employees"
        />
        <StatCard
          title="Average Salary"
          value={`₹${getAverageSalary()}`}
          icon={DollarSign}
          color="bg-green-500"
          subtitle="Per month"
        />
        <StatCard
          title="Total Payroll"
          value={`₹${workers.reduce((sum, w) => sum + w.salary, 0).toLocaleString()}`}
          icon={TrendingUp}
          color="bg-purple-500"
          subtitle="Monthly expense"
        />
        <StatCard
          title="Roles Covered"
          value={getUniqueRoles().length}
          icon={Target}
          color="bg-orange-500"
          subtitle="Job categories"
        />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <PieChartIcon className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Role Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={roleData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="count"
              >
                {roleData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Shift Distribution */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Clock className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Shift Distribution</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={shiftData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Salary by Role */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <DollarSign className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Average Salary by Role</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={roleData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Bar dataKey="avgSalary" fill="#10b981" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Top Earners */}
        <div className="card">
          <div className="flex items-center space-x-2 mb-4">
            <Award className="h-5 w-5 text-gray-600" />
            <h2 className="text-xl font-semibold text-gray-900">Top Earners</h2>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={salaryData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={80} />
              <YAxis />
              <Tooltip formatter={(value) => `₹${value}`} />
              <Line type="monotone" dataKey="salary" stroke="#f59e0b" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performers Table */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Top Performers by Role</h2>
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
              {topPerformers?.topByRole?.map((worker, index) => (
                <tr key={worker._id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-3">
                      <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-yellow-700">
                          {index + 1}
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
                  <td className="py-3 px-4 font-medium text-gray-900">₹{worker.salary.toLocaleString()}</td>
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
          {(!topPerformers?.topByRole || topPerformers.topByRole.length === 0) && (
            <div className="text-center py-8 text-gray-500">
              No data available
            </div>
          )}
        </div>
      </div>

      {/* Collection Concepts Demonstration */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Collection Concepts Applied</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-medium text-blue-900 mb-2">List (ArrayList)</h3>
            <p className="text-sm text-blue-800">
              Workers stored in dynamic array with O(1) access time
            </p>
            <p className="text-xs text-blue-600 mt-1">Size: {workers.length} elements</p>
          </div>
          
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <h3 className="font-medium text-green-900 mb-2">Set (HashSet)</h3>
            <p className="text-sm text-green-800">
              Unique roles stored with no duplicates
            </p>
            <p className="text-xs text-green-600 mt-1">Size: {getUniqueRoles().length} unique roles</p>
          </div>
          
          <div className="p-4 bg-purple-50 border border-purple-200 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Map (HashMap)</h3>
            <p className="text-sm text-purple-800">
              Workers grouped by role for quick lookup
            </p>
            <p className="text-xs text-purple-600 mt-1">Keys: {Object.keys(getWorkersByRole()).length} groups</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
