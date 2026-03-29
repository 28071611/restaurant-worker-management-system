import React, { useState, useEffect } from 'react';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees, formatBonus } from '../utils/currencyUtils';
import StarRating from './StarRating';
import { 
  Trophy, 
  Star, 
  TrendingUp, 
  Users, 
  Award,
  Calendar,
  Target,
  AlertCircle
} from 'lucide-react';

const ReputationDashboard = () => {
  const { workers } = React.useContext(WorkerContext);
  const [reputationData, setReputationData] = useState([]);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchReputationRanking();
    fetchEmployeeOfMonth();
  }, [selectedMonth, selectedYear]);

  const fetchReputationRanking = async () => {
    try {
      const response = await fetch('/api/reputation/ranking');
      const data = await response.json();
      if (data.success) {
        setReputationData(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch reputation data:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployeeOfMonth = async () => {
    try {
      const response = await fetch(`/api/reputation/employee-of-month?month=${selectedMonth}&year=${selectedYear}`);
      const data = await response.json();
      if (data.success) {
        setEmployeeOfMonth(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch employee of month:', error);
    }
  };

  const handleSelectEmployeeOfMonth = async () => {
    try {
      const response = await fetch('/api/reputation/employee-of-month/select', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          month: selectedMonth,
          year: selectedYear
        })
      });

      const data = await response.json();
      if (data.success) {
        setEmployeeOfMonth(data.data.employee);
        alert('Employee of the month selected successfully!');
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Failed to select employee of the month');
    }
  };

  const ReputationCard = ({ worker, rank, isEmployeeOfMonth = false }) => (
    <div className={`card p-6 relative ${
      isEmployeeOfMonth ? 'border-2 border-yellow-400 bg-gradient-to-br from-yellow-50 to-white' : ''
    }`}>
      {isEmployeeOfMonth && (
        <div className="absolute -top-3 -right-3">
          <div className="bg-yellow-400 text-white p-2 rounded-full">
            <Trophy className="h-6 w-6" />
          </div>
        </div>
      )}
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <div className="h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center">
              <span className="text-lg font-bold text-primary-700">
                {worker.name.charAt(0).toUpperCase()}
              </span>
            </div>
            {rank <= 3 && (
              <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                rank === 1 ? 'bg-yellow-500' : rank === 2 ? 'bg-gray-400' : 'bg-orange-600'
              }`}>
                {rank}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
            <p className="text-sm text-gray-600">{worker.role}</p>
          </div>
        </div>
        
        <div className="text-right">
          <div className="text-2xl font-bold text-primary-600">
            {worker.reputationScore}
          </div>
          <div className="text-xs text-gray-500">Reputation Score</div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2">
          <Star className="h-4 w-4 text-yellow-400" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {worker.avgRating.toFixed(1)}
            </div>
            <div className="text-xs text-gray-500">Avg Rating</div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4 text-blue-500" />
          <div>
            <div className="text-sm font-medium text-gray-900">
              {worker.totalRatings}
            </div>
            <div className="text-xs text-gray-500">Total Ratings</div>
          </div>
        </div>
      </div>

      {worker.totalComplaints > 0 && (
        <div className="mt-4 flex items-center space-x-2 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">{worker.totalComplaints} complaint(s)</span>
        </div>
      )}

      {isEmployeeOfMonth && employeeOfMonth && (
        <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-yellow-800">Bonus Awarded</span>
            <div className="text-lg font-bold text-yellow-900">
              {formatBonus(employeeOfMonth.bonusAmount)}
            </div>
          </div>
        </div>
      )}
    </div>
  );

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

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Reputation Dashboard</h1>
          <p className="text-gray-600 mt-1">Worker performance and reputation analysis</p>
        </div>
        
        <div className="flex items-center space-x-4">
          <select
            value={`${selectedMonth}-${selectedYear}`}
            onChange={(e) => {
              const [month, year] = e.target.value.split('-').map(Number);
              setSelectedMonth(month);
              setSelectedYear(year);
            }}
            className="input-field"
          >
            <option value={`${new Date().getMonth() + 1}-${new Date().getFullYear()}`}>
              Current Month
            </option>
            <option value={`${new Date().getMonth()}-${new Date().getFullYear()}`}>
              Last Month
            </option>
          </select>
          
          <button
            onClick={handleSelectEmployeeOfMonth}
            className="btn-primary flex items-center space-x-2"
          >
            <Trophy className="h-4 w-4" />
            <span>Select Employee of Month</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Workers"
          value={reputationData.length}
          icon={Users}
          color="bg-blue-500"
          subtitle="In reputation system"
        />
        <StatCard
          title="Avg Reputation Score"
          value={reputationData.length > 0 
            ? (reputationData.reduce((sum, w) => sum + w.reputationScore, 0) / reputationData.length).toFixed(1)
            : '0'
          }
          icon={TrendingUp}
          color="bg-green-500"
          subtitle="Across all workers"
        />
        <StatCard
          title="Employee of Month"
          value={employeeOfMonth ? employeeOfMonth.workerId.name : 'Not Selected'}
          icon={Trophy}
          color="bg-yellow-500"
          subtitle={employeeOfMonth ? `Score: ${employeeOfMonth.reputationScore}` : 'Pending selection'}
        />
        <StatCard
          title="Top Performer"
          value={reputationData[0]?.name || 'N/A'}
          icon={Award}
          color="bg-purple-500"
          subtitle={reputationData[0] ? `Score: ${reputationData[0].reputationScore}` : 'No data'}
        />
      </div>

      {/* Employee of the Month Highlight */}
      {employeeOfMonth && (
        <div className="card bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-yellow-400 p-3 rounded-full">
                <Trophy className="h-8 w-8 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Employee of the Month</h2>
                <p className="text-gray-600">
                  {employeeOfMonth.workerId.name} - {employeeOfMonth.workerId.role}
                </p>
              </div>
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-yellow-600">
                {employeeOfMonth.reputationScore}
              </div>
              <div className="text-sm text-gray-600">Reputation Score</div>
              <div className="text-lg font-bold text-green-600 mt-1">
                Bonus: ₹{employeeOfMonth.bonusAmount}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Reputation Ranking */}
      <div className="card">
        <h2 className="text-xl font-semibold text-gray-900 mb-6">Reputation Ranking</h2>
        
        {reputationData.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reputationData.map((worker, index) => (
              <ReputationCard
                key={worker.workerId}
                worker={worker}
                rank={index + 1}
                isEmployeeOfMonth={employeeOfMonth?.workerId._id === worker.workerId}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Reputation Data</h3>
            <p className="text-gray-600 mb-4">
              Start rating workers to see their reputation scores
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReputationDashboard;
