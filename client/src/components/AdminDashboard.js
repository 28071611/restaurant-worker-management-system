import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees } from '../utils/currencyUtils';
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
  MessageSquare,
  Plus,
  Phone,
  Clock
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

  if (loading) {
    return (
      <div className="flex bg-black items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative text-white">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url("/background.png")' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-transparent to-black" />

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} sidebar-glass transition-all duration-500 ease-in-out flex flex-col`}>
          <div className="p-8">
            <h2 className="text-2xl font-bold premium-gradient-text tracking-tighter">STAFFMASTER PRO</h2>
            <p className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] mt-1 uppercase">Admin Control Unit</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <BarChart3 className="h-5 w-5" />
              <span className="font-semibold">Core Terminal</span>
            </button>
            {[
              { label: 'Personnel List', icon: Users, path: '/workers' },
              { label: 'Recruit Worker', icon: Plus, path: '/add-worker' },
              { label: 'User Feedback', icon: MessageSquare, path: '/reviews' },
              { label: 'Staff Ranking', icon: Trophy, path: '/reputation' },
              { label: 'Intelligence', icon: Award, path: '/analytics' },
              { label: 'System Settings', icon: Settings, path: '/settings' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-400 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
              >
                <item.icon className="h-5 w-5 group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 bg-black/20">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-bold uppercase text-xs tracking-widest">Terminate Session</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-10">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
            <div className="flex items-center space-x-5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 glass-card hover:bg-white/10 text-white rounded-2xl transition-all shadow-xl"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Admin Panel</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-gray-400 text-sm font-medium">Node Primary • Database Linked</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 glass-card p-4 border-emerald-500/20 shadow-emerald-500/5">
              <div className="text-right">
                <p className="text-sm font-black text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] font-bold text-emerald-500 tracking-widest">SYSTEM OVERSEER</p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/20">
                <span className="text-xl font-black text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <StatCard title="Total Staff" value={stats.totalWorkers} icon={Users} color="from-blue-600 to-indigo-700" pulse />
            <StatCard title="Avg Quality" value={stats.avgRating} icon={Star} color="from-amber-400 to-orange-600" />
            <StatCard title="Reviews" value={stats.totalRatings} icon={MessageSquare} color="from-emerald-500 to-teal-700" />
            <StatCard title="Alerts" value={stats.totalComplaints} icon={AlertCircle} color="from-rose-600 to-red-800" />
          </div>

          {/* Personnel Intel - Table showing personal details */}
          <section className="glass-card p-8 animate-fade-in border-t border-white/10" style={{ animationDelay: '200ms' }}>
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10">
              <div>
                <h3 className="text-3xl font-black text-white tracking-tight uppercase">Worker Intelligence</h3>
                <p className="text-gray-400 text-sm mt-1 font-medium">Full staff directory with personal credentials and payroll data</p>
              </div>
              <button
                onClick={() => navigate('/workers')}
                className="px-8 py-3 bg-white text-black font-black uppercase text-xs tracking-widest rounded-xl transition-all hover:bg-emerald-500 shadow-xl"
              >
                Access Full Records
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="table-glass">
                <thead>
                  <tr>
                    <th>Worker Identification</th>
                    <th>Role & Unit</th>
                    <th>Contact Credentials</th>
                    <th>Salary (INR)</th>
                    <th>Operating Shift</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {workers.length > 0 ? workers.slice(0, 8).map((worker) => (
                    <tr key={worker._id} className="group cursor-pointer" onClick={() => navigate(`/worker/${worker._id}`)}>
                      <td className="flex items-center space-x-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center shadow-inner group-hover:border-emerald-500/50 transition-colors">
                          {worker.employeeImage?.filename ? (
                            <img src={`/uploads/${worker.employeeImage.filename}`} className="h-full w-full object-cover rounded-2xl" alt="" />
                          ) : (
                            <span className="text-lg font-black text-white/20 group-hover:text-emerald-500 transition-colors">{worker.name.charAt(0)}</span>
                          )}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{worker.name}</span>
                          <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest">{worker.email || 'NO_IDENT_LINK'}</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col">
                          <span className="text-white font-bold text-sm tracking-tight">{worker.role}</span>
                          <span className="text-emerald-500 text-[10px] font-black uppercase tracking-tighter">{worker.department} Unit</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2 text-gray-300 font-mono text-xs">
                          <Phone className="h-3 w-3 text-emerald-500/50" />
                          <span>+91 {worker.phone}</span>
                        </div>
                      </td>
                      <td>
                        <span className="text-emerald-400 font-black text-base">
                          {formatIndianRupees(worker.salary)}
                        </span>
                      </td>
                      <td>
                        <div className="flex items-center space-x-2">
                          <Clock className="h-3 w-3 text-emerald-500" />
                          <span className="text-xs font-bold text-white/80 uppercase">
                            {worker.shift}
                          </span>
                        </div>
                      </td>
                      <td>
                        <span className={`inline-flex items-center px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest border ${worker.status === 'Active'
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-amber-500/10 text-amber-500 border-amber-500/20'
                          }`}>
                          {worker.status}
                        </span>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="6" className="text-center py-20 text-gray-500 font-bold uppercase tracking-widest">No Intelligence Data Available</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* Unit Champion Showcase */}
          {stats.employeeOfMonth && (
            <div className="glass-card p-10 premium-gradient relative overflow-hidden animate-fade-in group" style={{ animationDelay: '300ms' }}>
              <Trophy className="absolute -right-16 -bottom-16 h-80 w-80 text-white/10 transform -rotate-12 group-hover:scale-110 transition-transform duration-700" />
              <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-10">
                <div className="flex items-center space-x-8">
                  <div className="h-28 w-28 bg-white/10 backdrop-blur-2xl rounded-3xl flex items-center justify-center border border-white/20 shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent" />
                    <Award className="h-14 w-14 text-white relative z-10" />
                  </div>
                  <div>
                    <p className="text-emerald-200 text-xs font-black uppercase tracking-[0.3em] mb-2">Internal Apex Performance</p>
                    <h3 className="text-4xl lg:text-5xl font-black text-white uppercase tracking-tighter leading-none">UNIT CHAMPION</h3>
                    <p className="text-white/80 text-2xl font-bold mt-2 tracking-tight">
                      {stats.employeeOfMonth.workerId?.name} • <span className="text-white/60">{stats.employeeOfMonth.workerId?.role}</span>
                    </p>
                  </div>
                </div>
                <div className="flex flex-col items-center lg:items-end">
                  <div className="flex items-baseline space-x-2">
                    <span className="text-6xl font-black text-white leading-none">{stats.employeeOfMonth.reputationScore}</span>
                    <span className="text-sm font-black text-white/50 uppercase tracking-widest">PTS</span>
                  </div>
                  <div className="text-xs font-black text-white/40 uppercase tracking-[0.5em] mt-1 mb-6">Reputation Index</div>
                  <div className="bg-white text-emerald-700 px-8 py-3 rounded-2xl font-black text-xl shadow-2xl transform hover:scale-105 transition-transform cursor-default">
                    {formatIndianRupees(stats.employeeOfMonth.bonusAmount)} PRIZE
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

const StatCard = ({ title, value, icon: Icon, color, pulse }) => (
  <div className="glass-card p-8 flex items-center justify-between relative overflow-hidden group">
    <div className={`absolute top-0 right-0 h-32 w-32 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity blur-3xl`} />
    <div className="relative z-10">
      <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
      <div className="flex items-baseline space-x-1">
        <p className="text-4xl font-black text-white tracking-tighter">{value}</p>
        {pulse && <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping mb-1" />}
      </div>
    </div>
    <div className={`h-16 w-16 rounded-2xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
      <Icon className="h-8 w-8 text-white" />
    </div>
  </div>
);

export default AdminDashboard;
