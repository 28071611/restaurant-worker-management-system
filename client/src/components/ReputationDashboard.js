import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  AlertCircle,
  Activity,
  Shield,
  ArrowRight,
  ChevronRight,
  Medal,
  Crown
} from 'lucide-react';

const ReputationDashboard = () => {
  const navigate = useNavigate();
  const { workers } = React.useContext(WorkerContext);
  const [reputationData, setReputationData] = useState([]);
  const [employeeOfMonth, setEmployeeOfMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth() + 1);
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  useEffect(() => {
    fetchData();
  }, [selectedMonth, selectedYear]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [rankingRes, employeeRes] = await Promise.all([
        fetch('/api/reputation/ranking'),
        fetch(`/api/reputation/employee-of-month?month=${selectedMonth}&year=${selectedYear}`)
      ]);
      const rankingData = await rankingRes.json();
      const employeeData = await employeeRes.json();
      
      if (rankingData.success) setReputationData(rankingData.data);
      if (employeeData.success) setEmployeeOfMonth(employeeData.data);
      else setEmployeeOfMonth(null);
      
    } catch (error) {
      console.error('Failed to fetch reputation data:', error);
    } finally {
      setLoading(false);
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
        // We could use a custom glass toast here later
        alert('UNIT CHAMPION SELECTED SUCCESSFULLY');
        fetchData(); 
      } else {
        alert(data.message);
      }
    } catch (error) {
      alert('Neural link synchronization failed');
    }
  };

  const RankBadge = ({ rank }) => {
    if (rank === 1) return <Crown className="h-6 w-6 text-yellow-400 fill-yellow-400" />;
    if (rank === 2) return <Medal className="h-6 w-6 text-slate-300 fill-slate-300" />;
    if (rank === 3) return <Medal className="h-6 w-6 text-amber-600 fill-amber-600" />;
    return <span className="text-xl font-black text-white/20">{rank}</span>;
  };

  const ReputationCard = ({ worker, rank, isEmployeeOfMonth = false }) => (
    <div 
      onClick={() => navigate(`/worker/${worker.workerId}`)}
      className={`glass-card p-6 flex items-center justify-between group cursor-pointer border-t border-white/5 relative overflow-hidden transition-all duration-500 hover:border-emerald-500/30 ${
        isEmployeeOfMonth ? 'border-amber-500/30 bg-amber-500/5' : ''
      }`}
    >
      <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${rank === 1 ? 'from-yellow-400/20' : 'from-emerald-500/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-3xl`} />
      
      <div className="flex items-center space-x-6 relative z-10">
        <div className="w-12 flex justify-center">
          <RankBadge rank={rank} />
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="h-14 w-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-500/50 transition-colors">
            <span className="text-2xl font-black text-white/20 group-hover:text-emerald-500 transition-colors uppercase">
              {worker.name.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">
              {worker.name}
            </h3>
            <p className="text-emerald-500 text-[10px] font-black uppercase tracking-widest leading-none mt-1">
              {worker.role} Unit
            </p>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-12 relative z-10">
        <div className="text-center hidden md:block">
          <div className="flex items-center justify-center space-x-1 mb-1">
             <Star className="h-3 w-3 text-yellow-500 fill-yellow-500" />
             <span className="text-sm font-black text-white">{worker.avgRating.toFixed(1)}</span>
          </div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Quality Index</p>
        </div>

        <div className="text-center">
          <p className="text-3xl font-black text-emerald-400 tracking-tighter leading-none">{worker.reputationScore}</p>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Reputation</p>
        </div>

        <button className="p-3 bg-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-2xl transition-all border border-white/10 group-hover:translate-x-1">
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="glass-card p-8 flex items-center justify-between relative overflow-hidden group">
      <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl`} />
      <div className="relative z-10">
        <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
        <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest mt-1">{subtitle}</p>
      </div>
      <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
        <Icon className="h-8 w-8 text-white" />
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex bg-black items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative text-white pb-20">
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black" />
      <div className="fixed top-0 right-0 h-[600px] w-[600px] bg-emerald-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="fixed bottom-0 left-0 h-[600px] w-[600px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-fade-in">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Performance Apex</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Trophy className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Global Ranking Terminal</span>
              </div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest leading-none">Sector Personnel Benchmarks</p>
            </div>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="relative group">
               <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
               <select
                value={`${selectedMonth}-${selectedYear}`}
                onChange={(e) => {
                  const [month, year] = e.target.value.split('-').map(Number);
                  setSelectedMonth(month);
                  setSelectedYear(year);
                }}
                className="pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest appearance-none focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value={`${new Date().getMonth() + 1}-${new Date().getFullYear()}`} className="bg-neutral-900">Active Month</option>
                <option value={`${new Date().getMonth()}-${new Date().getFullYear()}`} className="bg-neutral-900">Previous Cycle</option>
              </select>
            </div>
            
            <button
              onClick={handleSelectEmployeeOfMonth}
              className="flex items-center space-x-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-widest rounded-2xl transition-all shadow-2xl shadow-emerald-500/20"
            >
              <Award className="h-5 w-5" />
              <span>Select Unit Champion</span>
            </button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StatCard
            title="Total assets"
            value={reputationData.length}
            icon={Users}
            color="from-blue-600 to-indigo-700"
            subtitle="Personnel Count"
          />
          <StatCard
            title="Avg Reputation"
            value={reputationData.length > 0 
              ? (reputationData.reduce((sum, w) => sum + w.reputationScore, 0) / reputationData.length).toFixed(1)
              : '0'
            }
            icon={TrendingUp}
            color="from-emerald-500 to-teal-700"
            subtitle="Sector Magnitude"
          />
          <StatCard
            title="Elite status"
            value={employeeOfMonth ? 'Assigned' : 'Pending'}
            icon={Trophy}
            color="from-amber-400 to-orange-600"
            subtitle={employeeOfMonth ? `Asset: ${employeeOfMonth.workerId.name}` : 'Awaiting Selection'}
          />
          <StatCard
            title="Prime Apex"
            value={reputationData[0]?.name.split(' ')[0] || 'N/A'}
            icon={Medal}
            color="from-purple-600 to-red-800"
            subtitle={reputationData[0] ? `Score: ${reputationData[0].reputationScore}` : 'No Intel'}
          />
        </div>

        {/* Employee of the Month Strategic Highlight */}
        {employeeOfMonth && (
          <div className="glass-card p-10 bg-gradient-to-r from-amber-500/20 via-transparent to-transparent border-t border-amber-500/30 overflow-hidden relative animate-fade-in group" style={{ animationDelay: '200ms' }}>
            <div className="absolute -right-32 -bottom-32 h-[400px] w-[400px] bg-amber-500/10 blur-[100px] rounded-full group-hover:bg-amber-500/20 transition-all duration-700" />
            <Crown className="absolute right-10 top-1/2 -translate-y-1/2 h-40 w-40 text-amber-500/5 -rotate-12 group-hover:scale-110 transition-transform duration-700" />
            
            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-10">
              <div className="flex items-center space-x-8">
                <div className="h-24 w-24 bg-amber-500/10 rounded-3xl flex items-center justify-center border border-amber-500/20 shadow-2xl relative">
                  <span className="text-4xl font-black text-amber-400 uppercase">
                    {employeeOfMonth.workerId.name.charAt(0)}
                  </span>
                  <div className="absolute -top-3 -right-3 h-8 w-8 bg-amber-500 rounded-full flex items-center justify-center shadow-lg border-2 border-black">
                     <Trophy className="h-4 w-4 text-black" />
                  </div>
                </div>
                <div>
                  <h2 className="text-emerald-500 text-xs font-black uppercase tracking-[0.4em] mb-2">Internal Unit Apex Performance</h2>
                  <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">{employeeOfMonth.workerId.name}</h3>
                  <div className="flex items-center space-x-3 mt-3">
                    <span className="text-amber-500 text-lg font-bold tracking-tight uppercase leading-none">{employeeOfMonth.workerId.role} Unit</span>
                    <span className="h-2 w-2 rounded-full bg-white/20" />
                    <span className="text-gray-500 font-bold uppercase text-[10px] tracking-widest">ID: {employeeOfMonth.workerId._id.slice(-8).toUpperCase()}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-center md:items-end">
                <div className="flex items-baseline space-x-2">
                  <span className="text-7xl font-black text-amber-500 tracking-tighter leading-none">{employeeOfMonth.reputationScore}</span>
                  <span className="text-sm font-black text-white/40 uppercase tracking-widest">Reputation</span>
                </div>
                <div className="mt-8 bg-amber-500 text-black px-10 py-3 rounded-2xl font-black text-xl shadow-2xl shadow-amber-500/30 transform hover:scale-105 transition-transform cursor-pointer">
                  {formatBonus(employeeOfMonth.bonusAmount)} PRIZE
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Global Standings Leaderboard */}
        <div className="space-y-6 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between px-6">
            <h2 className="text-2xl font-black text-white uppercase tracking-tight">Global Standings Leaderboard</h2>
            <div className="flex items-center space-x-6 text-[10px] font-black text-gray-500 uppercase tracking-widest">
              <span>Intel Accuracy: 100%</span>
              <span>Syncing: 8s Ago</span>
            </div>
          </div>
          
          {reputationData.length > 0 ? (
            <div className="grid grid-cols-1 gap-4">
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
            <div className="glass-card py-20 text-center border-dashed border-white/10">
              <Trophy className="h-16 w-16 text-gray-700 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-gray-600 uppercase tracking-tighter">Zero Reputation Points</h3>
              <p className="text-gray-600 text-xs font-bold mt-2 uppercase tracking-tight">No personnel metrics have been recorded in current cycle.</p>
              <button 
                onClick={() => navigate('/rate-worker')}
                className="mt-8 px-10 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all"
              >
                Initiate First Rating
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReputationDashboard;
