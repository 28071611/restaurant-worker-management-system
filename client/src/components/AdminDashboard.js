import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees, formatTotalPayroll } from '../utils/currencyUtils';
import { 
  Users, 
  Star, 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Trophy,
  Settings,
  LogOut,
  Menu,
  X,
  BarChart3,
  Award,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { workers } = React.useContext(WorkerContext);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [stats, setStats] = useState({
    totalWorkers: 0,
    totalRatings: 0,
    avgRating: 0,
    totalComplaints: 0,
    employeeOfMonth: null
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
    
    // Keyboard shortcut for admin dashboard
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin/dashboard');
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [navigate]);

  const fetchDashboardStats = async () => {
    try {
      setLoading(true);
      
      // Fetch various stats
      const [ratingsData, complaintsData, employeeOfMonth] = await Promise.all([
        fetch('/api/reputation/ranking').then(res => res.json()),
        fetch('/api/analytics/dashboard').then(res => res.json()),
        fetch('/api/reputation/employee-of-month').then(res => res.json())
      ]);

      const ratings = ratingsData.success ? ratingsData.data : [];
      const totalRatings = ratings.reduce((sum, worker) => sum + worker.totalRatings, 0);
      const avgRating = ratings.length > 0 
        ? ratings.reduce((sum, worker) => sum + worker.avgRating, 0) / ratings.length 
        : 0;

      setStats({
        totalWorkers: workers.length,
        totalRatings,
        avgRating: avgRating.toFixed(1),
        totalComplaints: ratings.reduce((sum, worker) => sum + worker.totalComplaints, 0),
        employeeOfMonth: employeeOfMonth.success ? employeeOfMonth.data : null
      });
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="stat-card hover:shadow-lg transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
          {trend && (
            <div className={`flex items-center mt-2 text-sm ${
              trend > 0 ? 'text-green-600' : 'text-red-600'
            }`}>
              {trend > 0 ? <TrendingUp className="h-4 w-4 mr-1" /> : <AlertCircle className="h-4 w-4 mr-1" />}
              {trend > 0 ? '+' : ''}{trend}% from last month
            </div>
          )}
        </div>
        <div className={`p-3 rounded-lg ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left"
    >
      <div className={`w-12 h-12 ${color} rounded-lg flex items-center justify-center mb-4`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </button>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
              <div className="h-8 w-8 bg-primary-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-primary-700">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-md transition-all duration-300 overflow-hidden`}>
          <nav className="mt-8 px-4">
            <div className="space-y-2">
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-primary-100 text-primary-700 rounded-lg">
                <BarChart3 className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => navigate('/workers')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Users className="h-5 w-5" />
                <span>Workers</span>
              </button>
              <button 
                onClick={() => navigate('/add-worker')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Users className="h-5 w-5" />
                <span>Add Worker</span>
              </button>
              <button 
                onClick={() => navigate('/reputation')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Trophy className="h-5 w-5" />
                <span>Reputation</span>
              </button>
              <button 
                onClick={() => navigate('/analytics')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <BarChart3 className="h-5 w-5" />
                <span>Analytics</span>
              </button>
              <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome back, {user?.name}!</h2>
              <p className="text-gray-600 mt-1">Here's what's happening with your restaurant today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <StatCard
                title="Total Workers"
                value={stats.totalWorkers}
                icon={Users}
                color="bg-blue-500"
                subtitle="Active staff members"
                trend={12}
              />
              <StatCard
                title="Total Ratings"
                value={stats.totalRatings}
                icon={Star}
                color="bg-yellow-500"
                subtitle="Customer feedback"
                trend={8}
              />
              <StatCard
                title="Average Rating"
                value={stats.avgRating}
                icon={Trophy}
                color="bg-green-500"
                subtitle="Out of 5 stars"
                trend={5}
              />
              <StatCard
                title="Total Complaints"
                value={stats.totalComplaints}
                icon={AlertCircle}
                color="bg-red-500"
                subtitle="Customer issues"
                trend={-15}
              />
            </div>

            {/* Employee of the Month */}
            {stats.employeeOfMonth && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 mb-8 border border-yellow-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="bg-yellow-400 p-3 rounded-full">
                      <Award className="h-8 w-8 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-900">Employee of the Month</h3>
                      <p className="text-gray-600">
                        {stats.employeeOfMonth.workerId?.name} - {stats.employeeOfMonth.workerId?.role}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-yellow-600">
                      {stats.employeeOfMonth.reputationScore}
                    </div>
                    <div className="text-sm text-gray-600">Reputation Score</div>
                    <div className="text-lg font-bold text-green-600">
                      {formatIndianRupees(stats.employeeOfMonth.bonusAmount)}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <QuickAction
                  title="Add Worker"
                  description="Register a new staff member"
                  icon={Users}
                  color="bg-blue-500"
                  onClick={() => navigate('/add-worker')}
                />
                <QuickAction
                  title="View Analytics"
                  description="Detailed performance metrics"
                  icon={BarChart3}
                  color="bg-purple-500"
                  onClick={() => navigate('/analytics')}
                />
                <QuickAction
                  title="Manage Reputation"
                  description="Worker performance tracking"
                  icon={Trophy}
                  color="bg-yellow-500"
                  onClick={() => navigate('/reputation')}
                />
                <QuickAction
                  title="System Settings"
                  description="Configure system preferences"
                  icon={Settings}
                  color="bg-gray-500"
                  onClick={() => navigate('/settings')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h3>
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="bg-green-100 p-2 rounded-full">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New worker registered</p>
                      <p className="text-xs text-gray-500">John Doe joined as Chef - 2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-yellow-100 p-2 rounded-full">
                      <Star className="h-4 w-4 text-yellow-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">New rating received</p>
                      <p className="text-xs text-gray-500">Sarah Smith rated Jane Wilson 5 stars - 1 hour ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="bg-blue-100 p-2 rounded-full">
                      <Trophy className="h-4 w-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">Employee of the Month selected</p>
                      <p className="text-xs text-gray-500">Mike Johnson selected for January - 3 hours ago</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
