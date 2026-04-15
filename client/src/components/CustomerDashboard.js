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
  ThumbsUp,
  ChevronRight,
  Shield,
  Activity,
  Heart
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

  const ActionButton = ({ title, description, icon: Icon, color, onClick }) => (
    <button
      onClick={onClick}
      className="glass-card p-8 text-left group hover:border-emerald-500/30 transition-all duration-500 relative overflow-hidden"
    >
      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`} />
      <div className={`w-14 h-14 ${color} rounded-2xl flex items-center justify-center mb-6 shadow-2xl group-hover:scale-110 transition-transform`}>
        <Icon className="h-6 w-6 text-white" />
      </div>
      <h3 className="text-xl font-black text-white uppercase tracking-tight mb-2">{title}</h3>
      <p className="text-gray-500 text-sm font-medium leading-relaxed">{description}</p>
      <div className="mt-6 flex items-center text-emerald-500 text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
        Initiate Sequence <ChevronRight className="ml-1 h-3 w-3" />
      </div>
    </button>
  );

  if (loading) {
    return (
      <div className="flex bg-black items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative text-white">
      {/* Background decoration */}
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black" />
      <div className="fixed top-0 right-0 h-[600px] w-[600px] bg-emerald-500/5 blur-[120px] rounded-full -mr-64 -mt-64" />
      <div className="fixed bottom-0 left-0 h-[600px] w-[600px] bg-blue-500/5 blur-[120px] rounded-full -ml-64 -mb-64" />

      <div className="relative z-10 flex h-screen overflow-hidden">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'w-72' : 'w-0'} sidebar-glass transition-all duration-500 ease-in-out flex flex-col`}>
          <div className="p-8">
            <h2 className="text-2xl font-bold premium-gradient-text tracking-tighter uppercase italic">Guest Core</h2>
            <p className="text-[10px] text-emerald-500 font-bold tracking-[0.2em] mt-1 uppercase">Customer Interface Unit</p>
          </div>

          <nav className="flex-1 px-4 space-y-1 overflow-y-auto">
            <button className="w-full flex items-center space-x-3 px-4 py-3 bg-emerald-500/10 text-emerald-400 rounded-xl border border-emerald-500/20">
              <Activity className="h-5 w-5" />
              <span className="font-semibold uppercase tracking-tight text-sm text-white">Service Hub</span>
            </button>
            {[
              { label: 'Review Personnel', icon: Star, path: '/rate-worker' },
              { label: 'Log Incident', icon: MessageSquare, path: '/file-complaint' },
              { label: 'Activity Logs', icon: Clock, path: '/my-ratings' },
              { label: 'Identity Profile', icon: User, path: '/profile' }
            ].map((item) => (
              <button
                key={item.label}
                onClick={() => navigate(item.path)}
                className="w-full flex items-center space-x-3 px-4 py-3 text-gray-500 hover:bg-white/5 hover:text-white rounded-xl transition-all group"
              >
                <item.icon className="h-5 w-5 group-hover:text-emerald-500 transition-colors" />
                <span className="font-medium uppercase tracking-tight text-xs text-white/60">{item.label}</span>
              </button>
            ))}
          </nav>

          <div className="p-6 border-t border-white/5 bg-black/20">
            <button
              onClick={logout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-rose-500 hover:bg-rose-500/10 rounded-xl transition-all border border-transparent hover:border-rose-500/20"
            >
              <LogOut className="h-5 w-5" />
              <span className="font-bold uppercase text-xs tracking-widest">Logout Cyber-Session</span>
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-10 space-y-12">
          <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 animate-fade-in">
            <div className="flex items-center space-x-5">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-3 glass-card hover:bg-white/10 text-white rounded-2xl transition-all shadow-xl"
              >
                {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter uppercase">Welcome, {user?.name.split(' ')[0]}</h1>
                <div className="flex items-center space-x-2 mt-1">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-gray-500 text-sm font-medium uppercase tracking-widest">Client Authenticated • Secure Link</p>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-4 glass-card p-4 border-emerald-500/20 shadow-emerald-500/5">
              <div className="text-right">
                <p className="text-sm font-black text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[10px] font-bold text-emerald-500 tracking-widest uppercase italic">Elite Guest Status</p>
              </div>
              <div className="h-14 w-14 bg-gradient-to-tr from-emerald-600 to-green-400 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 border border-white/20">
                <span className="text-xl font-black text-white">
                  {user?.name?.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          </header>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <StatCard
              title="Contributions"
              value={stats.totalRatings}
              icon={Star}
              color="from-amber-400 to-orange-600"
              subtitle="Feedback Metrics"
            />
            <StatCard
              title="Quality Index"
              value={stats.avgRating}
              icon={TrendingUp}
              color="from-emerald-500 to-teal-700"
              subtitle="Score Provided"
            />
            <StatCard
              title="Incident Log"
              value={stats.totalComplaints}
              icon={MessageSquare}
              color="from-rose-600 to-red-800"
              subtitle="Alerts Synchronized"
            />
          </div>

          {/* Quick Actions */}
          <section className="animate-fade-in shadow-2xl" style={{ animationDelay: '200ms' }}>
            <h3 className="text-2xl font-black text-white uppercase tracking-tight mb-8 ml-2">Override Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ActionButton
                title="Rate Personnel"
                description="Synchronize performance metrics for our dedicated staff units."
                icon={Star}
                color="bg-amber-500"
                onClick={() => navigate('/rate-worker')}
              />
              <ActionButton
                title="File Incident"
                description="Immediately log an alert for any operational discrepancies."
                icon={MessageSquare}
                color="bg-rose-600"
                onClick={() => navigate('/file-complaint')}
              />
              <ActionButton
                title="Service Matrix"
                description="Review current restaurant operational offerings and data."
                icon={Utensils}
                color="bg-emerald-600"
                onClick={() => navigate('/menu')}
              />
            </div>
          </section>

          {/* Activity Matrix */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            {/* Recent Ratings Matrix */}
            <section className="glass-card p-10 border-t border-white/10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Feedback Matrix</h3>
                  <p className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">Latest synchronization data</p>
                </div>
                <Star className="h-6 w-6 text-amber-500/30" />
              </div>
              
              {recentRatings.length > 0 ? (
                <div className="space-y-6">
                  {recentRatings.map((rating) => (
                    <div key={rating._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-amber-500/20 transition-all">
                      <div className="flex items-center space-x-4 text-white">
                        <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20">
                           <span className="font-black text-amber-500">{rating.workerId?.name?.charAt(0)}</span>
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-tight">{rating.workerId?.name}</p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{rating.serviceType}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-1">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < rating.rating ? 'text-amber-500 fill-amber-500' : 'text-white/10'}`}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 opacity-30">
                  <Star className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-[10px] uppercase font-black tracking-widest leading-none">Matrix Empty</p>
                </div>
              )}
            </section>

            {/* Recent Complaints Matrix */}
            <section className="glass-card p-10 border-t border-white/10">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Alert Archives</h3>
                  <p className="text-[10px] font-bold text-rose-500 uppercase tracking-widest mt-1">Stored discrepancy packets</p>
                </div>
                <MessageSquare className="h-6 w-6 text-rose-500/30" />
              </div>
              
              {recentComplaints.length > 0 ? (
                <div className="space-y-6">
                  {recentComplaints.map((complaint) => (
                    <div key={complaint._id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 group hover:border-rose-500/20 transition-all">
                      <div className="flex items-center space-x-4 text-white max-w-[70%]">
                        <div className="h-10 w-10 rounded-xl bg-rose-600/10 flex items-center justify-center border border-rose-600/20">
                           <Shield className="h-4 w-4 text-rose-600" />
                        </div>
                        <div className="truncate">
                          <p className="text-xs font-black uppercase tracking-tight truncate">{complaint.complaint}</p>
                          <p className="text-[9px] text-gray-500 uppercase font-bold tracking-widest">{new Date(complaint.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <span className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest rounded-lg border ${
                        complaint.status === 'Resolved' 
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20'
                          : 'bg-rose-500/10 text-rose-500 border-rose-500/20'
                      }`}>
                        {complaint.status}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 opacity-30">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4" />
                  <p className="text-[10px] uppercase font-black tracking-widest leading-none">Archives Clear</p>
                </div>
              )}
            </section>
          </div>

          {/* System Protocol Message */}
          <div className="glass-card p-10 bg-gradient-to-r from-emerald-500/10 to-transparent border-t border-emerald-500/30 animate-fade-in" style={{ animationDelay: '400ms' }}>
             <div className="flex items-center space-x-8">
               <div className="h-20 w-20 bg-emerald-500 rounded-3xl flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                  <Heart className="h-10 w-10 text-white fill-white animate-pulse" />
               </div>
               <div>
                 <h4 className="text-2xl font-black text-white uppercase tracking-tight mb-2">The Guest Protocol</h4>
                 <p className="text-gray-400 text-sm font-medium max-w-2xl leading-relaxed">
                   Your integration with our management system is vital for staff optimization. Every data-point you provide enhances our commitment to premium service excellence.
                 </p>
                 <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                       <Shield className="h-3 w-3 text-emerald-500" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Secure Interaction</span>
                    </div>
                    <div className="flex items-center space-x-2">
                       <ThumbsUp className="h-3 w-3 text-emerald-500" />
                       <span className="text-[10px] font-black text-white/40 uppercase tracking-widest">Quality Verified</span>
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
