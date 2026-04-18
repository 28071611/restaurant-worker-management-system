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
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  DollarSign, 
  Users, 
  Clock, 
  Award,
  Target,
  PieChart as PieChartIcon,
  Activity,
  Shield,
  ArrowRight
} from 'lucide-react';

const Analytics = () => {
  const { workers, getUniqueRoles, getWorkersByRole, getAverageSalary } = React.useContext(WorkerContext);
  const [topPerformers, setTopPerformers] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [analyticsRes, performersRes] = await Promise.all([
        fetch('/api/analytics/dashboard'),
        fetch('/api/analytics/top-performers')
      ]);
      await analyticsRes.json();
      const performersData = await performersRes.json();
      
      setTopPerformers(performersData.data);
    } catch (error) {
      console.error('Failed to fetch analytics:', error);
    } finally {
      setLoading(false);
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
  })).sort((a, b) => b.salary - a.salary).slice(0, 8);

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6'];

  const StatCard = ({ title, value, icon: Icon, color, subtitle, trend }) => (
    <div className="glass-card p-6 border-t border-white/5 relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-500">
      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`} />
      <div className="flex items-start justify-between relative z-10">
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
          <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
          <div className="flex items-center space-x-2 mt-2">
            <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-tight">{subtitle}</span>
            {trend && <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-2 py-0.5 rounded-full font-black">+{trend}%</span>}
          </div>
        </div>
        <div className={`p-4 rounded-2xl bg-gradient-to-tr ${color} shadow-2xl group-hover:scale-110 transition-transform`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex bg-black items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative text-white pb-20 overflow-hidden">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black" />
      <div className="fixed top-0 right-0 h-[500px] w-[500px] bg-emerald-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="fixed bottom-0 left-0 h-[500px] w-[500px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 space-y-12">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Intel terminal</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Activity className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Real-time Data Flow</span>
              </div>
              <p className="text-gray-500 text-xs font-medium uppercase tracking-widest leading-none">Global Unit Analytics • Sector 7</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 glass-card px-6 py-4 border-white/10">
            <div className="text-right">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">System Status</p>
              <p className="text-xs font-black text-emerald-500 uppercase">Synchronized</p>
            </div>
            <div className="h-10 w-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
              <Shield className="h-5 w-5 text-emerald-500" />
            </div>
          </div>
        </div>

        {/* Primary Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
          <StatCard
            title="Active Personnel"
            value={workers.length}
            icon={Users}
            color="from-emerald-600 to-green-400"
            subtitle="Operational Units"
            trend="12"
          />
          <StatCard
            title="Avg Unit Budget"
            value={`₹${getAverageSalary().toLocaleString()}`}
            icon={DollarSign}
            color="from-blue-600 to-indigo-400"
            subtitle="Monthly/Asset"
          />
          <StatCard
            title="Sector Payroll"
            value={`₹${workers.reduce((sum, w) => sum + w.salary, 0).toLocaleString()}`}
            icon={TrendingUp}
            color="from-purple-600 to-pink-400"
            subtitle="Total Expenditure"
            trend="8"
          />
          <StatCard
            title="Service Roles"
            value={getUniqueRoles().length}
            icon={Target}
            color="from-amber-600 to-orange-400"
            subtitle="Specialty Groups"
          />
        </div>

        {/* Intelligence Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
          {/* Role Radar */}
          <div className="glass-card p-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Specialty distribution</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Resource Allocation by Role</p>
              </div>
              <PieChartIcon className="h-6 w-6 text-emerald-500/30" />
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={roleData}
                    cx="50%"
                    cy="50%"
                    innerRadius={80}
                    outerRadius={120}
                    paddingAngle={8}
                    dataKey="count"
                    stroke="none"
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', color: '#fff' }}
                    itemStyle={{ color: '#fff' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Shift Logistics */}
          <div className="glass-card p-10 border-t border-white/10">
            <div className="flex items-center justify-between mb-10">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Shift Cycles</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Logistics Coverage Analysis</p>
              </div>
              <Clock className="h-6 w-6 text-blue-500/30" />
            </div>
            <div className="h-[350px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={shiftData}>
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    cursor={{ fill: 'rgba(255,255,255,0.05)' }}
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                    {shiftData.map((entry, index) => (
                      <Cell key={`cell-shift-${index}`} fill={entry.name === 'Morning' ? '#10b981' : entry.name === 'Evening' ? '#3b82f6' : '#8b5cf6'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Budget Trend */}
          <div className="glass-card p-10 border-t border-white/10 lg:col-span-2">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
              <div>
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Alpha Personnel payroll</h3>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">Top 8 Strategic Assets by Magnitude</p>
              </div>
              <div className="flex items-center space-x-6">
                <div className="flex items-center space-x-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500" />
                  <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Asset Value</span>
                </div>
              </div>
            </div>
            <div className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={salaryData}>
                  <defs>
                    <linearGradient id="colorSalary" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                  <XAxis dataKey="name" stroke="#666" fontSize={10} axisLine={false} tickLine={false} height={60} />
                  <YAxis stroke="#666" fontSize={10} axisLine={false} tickLine={false} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(0,0,0,0.8)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)' }}
                  />
                  <Area type="monotone" dataKey="salary" stroke="#10b981" strokeWidth={4} fillOpacity={1} fill="url(#colorSalary)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Asset Performance Grid */}
        <div className="glass-card p-10 border-t border-white/10 animate-fade-in" style={{ animationDelay: '300ms' }}>
          <div className="flex items-center justify-between mb-10">
            <div>
              <h3 className="text-3xl font-black text-white tracking-tight uppercase">High-Value Assets</h3>
              <p className="text-gray-400 text-sm mt-1 font-medium">Top performing personnel categorized by operational unit</p>
            </div>
            <Award className="h-10 w-10 text-emerald-500/20" />
          </div>

          <div className="overflow-x-auto">
            <table className="table-glass">
              <thead>
                <tr>
                  <th>Rank & Asset Identifier</th>
                  <th>Unit Specialty</th>
                  <th>Monthly Budget</th>
                  <th>Deployment Cycle</th>
                  <th>Sync Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {topPerformers?.topByRole?.map((worker, index) => (
                  <tr key={worker._id} className="group">
                    <td>
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center justify-center font-black text-emerald-500">
                          {index + 1}
                        </div>
                        <span className="font-black text-white group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{worker.name}</span>
                      </div>
                    </td>
                    <td>
                      <span className="text-[10px] font-black text-blue-400 border border-blue-400/30 px-3 py-1 rounded-md uppercase tracking-widest">{worker.role}</span>
                    </td>
                    <td>
                      <span className="font-black text-white">₹{worker.salary.toLocaleString()}</span>
                    </td>
                    <td>
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-tighter">{worker.shift} Cycle</span>
                    </td>
                    <td>
                      <div className="flex items-center space-x-2">
                        <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                        <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Access</span>
                      </div>
                    </td>
                    <td>
                      <button className="p-2.5 bg-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-xl transition-all border border-white/10">
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
