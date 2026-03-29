import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import { formatIndianRupees, formatYearlySalary } from '../utils/currencyUtils';
import { 
  User, 
  Star, 
  Calendar, 
  DollarSign, 
  TrendingUp,
  Clock,
  Phone,
  Award,
  MessageSquare,
  AlertCircle
} from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [worker, setWorker] = useState(null);
  const [ratings, setRatings] = useState([]);
  const [reputation, setReputation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchWorkerData();
  }, [id]);

  const fetchWorkerData = async () => {
    try {
      setLoading(true);
      
      // Fetch worker details
      const workerResponse = await fetch(`/api/workers/${id}`);
      const workerData = await workerResponse.json();
      
      if (workerData.success) {
        setWorker(workerData.data);
      }

      // Fetch ratings
      const ratingsResponse = await fetch(`/api/reputation/ratings/${id}`);
      const ratingsData = await ratingsResponse.json();
      
      if (ratingsData.success) {
        setRatings(ratingsData.data.ratings);
      }

      // Fetch reputation score
      const reputationResponse = await fetch(`/api/reputation/reputation/${id}`);
      const reputationData = await reputationResponse.json();
      
      if (reputationData.success) {
        setReputation(reputationData.data);
      }
    } catch (error) {
      setError('Failed to fetch worker data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  if (error || !worker) {
    return (
      <div className="text-center py-12">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Worker Not Found</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button
          onClick={() => navigate('/workers')}
          className="btn-primary"
        >
          Back to Workers
        </button>
      </div>
    );
  }

  const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="stat-card">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="h-5 w-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-lg font-semibold text-gray-900">{value}</p>
        </div>
      </div>
    </div>
  );

  const RatingCard = ({ rating }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-2">
          <User className="h-4 w-4 text-gray-500" />
          <span className="font-medium text-gray-900">{rating.clientName}</span>
        </div>
        <div className="flex items-center space-x-2">
          <StarRating rating={rating.rating} readonly size="sm" />
          <span className="text-sm text-gray-500">
            {new Date(rating.date).toLocaleDateString()}
          </span>
        </div>
      </div>
      
      <div className="flex items-center space-x-2 mb-2">
        <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
          {rating.serviceType}
        </span>
      </div>
      
      {rating.feedback && (
        <div className="flex items-start space-x-2">
          <MessageSquare className="h-4 w-4 text-gray-400 mt-0.5" />
          <p className="text-sm text-gray-600 italic">"{rating.feedback}"</p>
        </div>
      )}
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          ← Back
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Worker Profile</h1>
          <p className="text-gray-600 mt-1">Detailed performance analysis</p>
        </div>
      </div>

      {/* Worker Info Card */}
      <div className="card">
        <div className="flex items-start justify-between">
          <div className="flex items-center space-x-6">
            <div className="h-20 w-20 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-2xl font-bold text-primary-700">
                {worker.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{worker.name}</h2>
              <p className="text-lg text-gray-600">{worker.role}</p>
              <div className="flex items-center space-x-4 mt-2">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  worker.status === 'Active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {worker.status}
                </span>
                <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                  {worker.shift}
                </span>
              </div>
            </div>
          </div>
          
          {reputation && (
            <div className="text-right">
              <div className="text-3xl font-bold text-primary-600">
                {reputation.reputationScore}
              </div>
              <div className="text-sm text-gray-600">Reputation Score</div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Salary"
          value={formatIndianRupees(worker.salary)}
          icon={DollarSign}
          color="bg-green-500"
        />
        <StatCard
          title="Phone"
          value={worker.phone}
          icon={Phone}
          color="bg-blue-500"
        />
        <StatCard
          title="Joined"
          value={new Date(worker.joinDate).toLocaleDateString()}
          icon={Calendar}
          color="bg-purple-500"
        />
        <StatCard
          title="Experience"
          value={reputation ? `${reputation.breakdown.experienceMonths} months` : 'N/A'}
          icon={Clock}
          color="bg-orange-500"
        />
      </div>

      {/* Reputation Breakdown */}
      {reputation && (
        <div className="card">
          <h3 className="text-xl font-semibold text-gray-900 mb-4">Performance Breakdown</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <Star className="h-8 w-8 text-yellow-400" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {reputation.breakdown.avgRating.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Average Rating</div>
              <div className="text-xs text-gray-500 mt-1">
                {reputation.breakdown.totalRatings} ratings
              </div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="h-8 w-8 text-green-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {reputation.breakdown.attendancePercentage.toFixed(1)}%
              </div>
              <div className="text-sm text-gray-600">Attendance</div>
            </div>
            
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <AlertCircle className="h-8 w-8 text-red-500" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {reputation.breakdown.totalComplaints}
              </div>
              <div className="text-sm text-gray-600">Complaints</div>
            </div>
          </div>
        </div>
      )}

      {/* Recent Ratings */}
      <div className="card">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-gray-900">Recent Ratings</h3>
          <button
            onClick={() => navigate(`/rate-worker/${id}`)}
            className="btn-primary flex items-center space-x-2"
          >
            <Star className="h-4 w-4" />
            <span>Rate Worker</span>
          </button>
        </div>
        
        {ratings.length > 0 ? (
          <div className="space-y-4">
            {ratings.slice(0, 5).map(rating => (
              <RatingCard key={rating._id} rating={rating} />
            ))}
            
            {ratings.length > 5 && (
              <div className="text-center">
                <button className="btn-secondary">
                  View All {ratings.length} Ratings
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <Star className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Ratings Yet</h3>
            <p className="text-gray-600 mb-4">Be the first to rate this worker!</p>
            <button
              onClick={() => navigate(`/rate-worker/${id}`)}
              className="btn-primary"
            >
              Rate Worker
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerProfile;
