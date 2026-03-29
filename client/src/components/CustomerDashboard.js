import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Star, 
  MessageSquare, 
  User, 
  Clock,
  TrendingUp,
  Award,
  LogOut,
  Menu,
  X,
  Utensils,
  AlertCircle,
  ThumbsUp
} from 'lucide-react';

const CustomerDashboard = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [recentRatings, setRecentRatings] = useState([]);
  const [recentComplaints, setRecentComplaints] = useState([]);
  const [stats, setStats] = useState({
    totalRatings: 0,
    avgRating: 0,
    totalComplaints: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomerData();
  }, []);

  const fetchCustomerData = async () => {
    try {
      setLoading(true);
      
      // Fetch customer's ratings and complaints
      const [ratingsData, complaintsData] = await Promise.all([
        fetch('/api/reputation/ratings').then(res => res.json()),
        fetch('/api/complaints/customer').then(res => res.json())
      ]);

      const ratings = ratingsData.success ? ratingsData.data.ratings : [];
      const complaints = complaintsData.success ? complaintsData.data : [];

      // Filter by current customer (you'd need to modify backend to filter by customer)
      const customerRatings = ratings.slice(0, 5);
      const customerComplaints = complaints.slice(0, 5);

      const totalRatings = customerRatings.length;
      const avgRating = totalRatings > 0 
        ? customerRatings.reduce((sum, r) => sum + r.rating, 0) / totalRatings 
        : 0;

      setRecentRatings(customerRatings);
      setRecentComplaints(customerComplaints);
      setStats({
        totalRatings,
        avgRating: avgRating.toFixed(1),
        totalComplaints: customerComplaints.length
      });
    } catch (error) {
      console.error('Failed to fetch customer data:', error);
    } finally {
      setLoading(false);
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="stat-card hover:shadow-lg transition-shadow duration-200">
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

  const QuickAction = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="p-6 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200 text-left w-full"
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
              <h1 className="ml-4 text-2xl font-bold text-gray-900">Customer Portal</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">Customer</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-sm font-medium text-green-700">
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
              <button className="w-full flex items-center space-x-3 px-3 py-2 bg-green-100 text-green-700 rounded-lg">
                <User className="h-5 w-5" />
                <span>Dashboard</span>
              </button>
              <button 
                onClick={() => navigate('/rate-worker')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Star className="h-5 w-5" />
                <span>Rate Worker</span>
              </button>
              <button 
                onClick={() => navigate('/file-complaint')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <MessageSquare className="h-5 w-5" />
                <span>File Complaint</span>
              </button>
              <button 
                onClick={() => navigate('/my-ratings')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <Clock className="h-5 w-5" />
                <span>My Ratings</span>
              </button>
              <button 
                onClick={() => navigate('/profile')}
                className="w-full flex items-center space-x-3 px-3 py-2 text-gray-700 hover:bg-gray-100 rounded-lg"
              >
                <User className="h-5 w-5" />
                <span>My Profile</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-6">
          <div className="max-w-7xl mx-auto">
            {/* Welcome Section */}
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome, {user?.name}!</h2>
              <p className="text-gray-600 mt-1">Thank you for being our valued customer.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                title="Total Ratings"
                value={stats.totalRatings}
                icon={Star}
                color="bg-yellow-500"
                subtitle="Your feedback contributions"
              />
              <StatCard
                title="Average Rating Given"
                value={stats.avgRating}
                icon={TrendingUp}
                color="bg-green-500"
                subtitle="Out of 5 stars"
              />
              <StatCard
                title="Complaints Filed"
                value={stats.totalComplaints}
                icon={MessageSquare}
                color="bg-blue-500"
                subtitle="Issues reported"
              />
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <QuickAction
                  title="Rate Worker"
                  description="Share your experience with our staff"
                  icon={Star}
                  color="bg-yellow-500"
                  onClick={() => navigate('/rate-worker')}
                />
                <QuickAction
                  title="File Complaint"
                  description="Report any issues or concerns"
                  icon={MessageSquare}
                  color="bg-red-500"
                  onClick={() => navigate('/file-complaint')}
                />
                <QuickAction
                  title="View Menu"
                  description="Check our restaurant menu"
                  icon={Utensils}
                  color="bg-green-500"
                  onClick={() => navigate('/menu')}
                />
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Ratings */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Ratings</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {recentRatings.length > 0 ? (
                    <div className="space-y-4">
                      {recentRatings.map((rating) => (
                        <div key={rating._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="bg-yellow-100 p-2 rounded-full">
                            <Star className="h-4 w-4 text-yellow-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {rating.workerId?.name || 'Unknown Worker'}
                              </p>
                              <div className="flex items-center space-x-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < rating.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                            </div>
                            <p className="text-xs text-gray-500">
                              {new Date(rating.date).toLocaleDateString()} - {rating.serviceType}
                            </p>
                            {rating.feedback && (
                              <p className="text-sm text-gray-600 mt-1 italic">"{rating.feedback}"</p>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No ratings yet</p>
                      <button
                        onClick={() => navigate('/rate-worker')}
                        className="mt-4 btn-primary"
                      >
                        Rate a Worker
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Recent Complaints */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Complaints</h3>
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                  {recentComplaints.length > 0 ? (
                    <div className="space-y-4">
                      {recentComplaints.map((complaint) => (
                        <div key={complaint._id} className="flex items-start space-x-3 pb-4 border-b border-gray-100 last:border-0">
                          <div className="bg-red-100 p-2 rounded-full">
                            <MessageSquare className="h-4 w-4 text-red-600" />
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-1">
                              <p className="text-sm font-medium text-gray-900">
                                {complaint.workerId?.name || 'General'}
                              </p>
                              <span className={`px-2 py-1 text-xs rounded-full ${
                                complaint.status === 'Resolved' 
                                  ? 'bg-green-100 text-green-800'
                                  : complaint.status === 'Investigating'
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-gray-100 text-gray-800'
                              }`}>
                                {complaint.status}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600">{complaint.complaint}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              {new Date(complaint.date).toLocaleDateString()} - {complaint.severity}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500">No complaints filed</p>
                      <button
                        onClick={() => navigate('/file-complaint')}
                        className="mt-4 btn-secondary"
                      >
                        File a Complaint
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Restaurant Info */}
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Restaurant Information</h3>
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
                <div className="flex items-center space-x-4">
                  <div className="bg-blue-500 p-3 rounded-full">
                    <Utensils className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h4 className="text-lg font-semibold text-gray-900">Restaurant Worker Management System</h4>
                    <p className="text-gray-600 mt-1">
                      Thank you for choosing our restaurant! Your feedback helps us improve our service quality.
                    </p>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-1">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-gray-700">Quality Service</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-gray-700">Expert Staff</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Award className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-700">Award Winning</span>
                      </div>
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

export default CustomerDashboard;
