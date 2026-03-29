import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import StarRating from './StarRating';
import { formatIndianRupees } from '../utils/currencyUtils';
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
  AlertCircle,
  ArrowLeft,
  ChevronRight,
  Shield,
  Activity
} from 'lucide-react';

const WorkerProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
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

      const [workerRes, ratingsRes, reputationRes] = await Promise.all([
        fetch(`/api/workers/${id}`).then(res => res.json()),
        fetch(`/api/reputation/ratings/${id}`).then(res => res.json()),
        fetch(`/api/reputation/reputation/${id}`).then(res => res.json())
      ]);

      if (workerRes.success) setWorker(workerRes.data);
      if (ratingsRes.success) setRatings(ratingsRes.data.ratings);
      if (reputationRes.success) setReputation(reputationRes.data);

    } catch (error) {
      setError('Intelligence Retrieval Failed');
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

  if (error || !worker) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-8">
        <div className="glass-card p-12 text-center max-w-lg">
          <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-6" />
          <h3 className="text-3xl font-black text-white uppercase tracking-tighter mb-4">Asset Not Located</h3>
          <p className="text-gray-400 font-medium mb-8 uppercase text-xs tracking-widest">{error || 'The requested personnel record does not exist in the secure vault.'}</p>
          <button onClick={() => navigate(-1)} className="px-8 py-4 bg-white text-black font-black uppercase text-xs tracking-widest rounded-2xl hover:bg-emerald-500 transition-all">
            Return to Terminal
          </button>
        </div>
      </div>
    );
  }

  const StatBlock = ({ title, value, icon: Icon, color }) => (
    <div className="glass-card p-6 border-l-4 border-l-transparent hover:border-l-emerald-500 transition-all">
      <div className="flex items-center space-x-4">
        <div className={`p-3 rounded-2xl bg-gradient-to-tr ${color} shadow-lg`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em]">{title}</p>
          <p className="text-xl font-black text-white tracking-tight uppercase mt-1">{value}</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative text-white pb-20">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-40"
        style={{ backgroundImage: 'url("/background.png")' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black" />

      <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 space-y-10">
        {/* Navigation Head */}
        <div className="flex items-center space-x-4 animate-fade-in">
          <button onClick={() => navigate(-1)} className="p-3 glass-card hover:bg-white/10 text-white rounded-2xl transition-all">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Asset Identity</h1>
            <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em] flex items-center space-x-2 mt-1">
              <Shield className="h-3 w-3" />
              <span>Full Intelligence Record • SEC_LEVEL_01</span>
            </p>
          </div>
        </div>

        {/* Hero Asset Card */}
        <div className="glass-card p-10 relative overflow-hidden animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="absolute top-0 right-0 h-96 w-96 bg-emerald-500 opacity-5 blur-[120px] rounded-full -mr-48 -mt-48" />

          <div className="relative z-10 flex flex-col md:flex-row items-center md:items-start gap-10">
            <div className="relative">
              <div className="h-40 w-40 rounded-[2.5rem] bg-white/5 border-2 border-white/10 flex items-center justify-center overflow-hidden shadow-2xl relative">
                {worker.employeeImage?.filename ? (
                  <img src={`/uploads/${worker.employeeImage.filename}`} className="h-full w-full object-cover" alt="" />
                ) : (
                  <span className="text-6xl font-black text-white/10">{worker.name.charAt(0)}</span>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
              </div>
              <div className={`absolute -bottom-2 -right-2 px-4 py-1.5 rounded-xl border-2 border-black font-black text-[10px] uppercase tracking-widest ${worker.status === 'Active' ? 'bg-emerald-500 text-black' : 'bg-amber-500 text-black'
                }`}>
                {worker.status}
              </div>
            </div>

            <div className="flex-1 text-center md:text-left">
              <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
                <h2 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{worker.name}</h2>
                {reputation && (
                  <div className="inline-flex items-center px-4 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                    <Star className="h-4 w-4 text-emerald-500 fill-emerald-500 mr-2" />
                    <span className="text-lg font-black text-emerald-400">{reputation.reputationScore} REPUTATION</span>
                  </div>
                )}
              </div>

              <div className="flex flex-wrap justify-center md:justify-start gap-3 items-center">
                <span className="text-2xl font-bold text-gray-500 uppercase tracking-tighter">{worker.role} Unit</span>
                <span className="h-2 w-2 rounded-full bg-white/20" />
                <span className="text-gray-400 font-medium uppercase text-xs tracking-widest">Joined {new Date(worker.joinDate).toLocaleDateString()}</span>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
                <StatBlock title="Operating Budget" value={formatIndianRupees(worker.salary)} icon={DollarSign} color="from-emerald-600 to-green-400" />
                <StatBlock title="Comm Channel" value={`+91 ${worker.phone}`} icon={Phone} color="from-blue-600 to-indigo-500" />
                <StatBlock title="Shift Cycle" value={worker.shift} icon={Clock} color="from-purple-600 to-pink-500" />
                <StatBlock title="Experience Index" value={reputation ? `${reputation.breakdown.experienceMonths} MO` : 'N/A'} icon={Activity} color="from-amber-600 to-orange-400" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Performance Radar */}
          <section className="lg:col-span-2 space-y-10 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {reputation && (
              <div className="glass-card p-10 border-t border-emerald-500/20">
                <div className="flex items-center justify-between mb-10">
                  <h3 className="text-2xl font-black text-white uppercase tracking-tight">Efficiency Metrics</h3>
                  <Award className="h-8 w-8 text-emerald-500/30" />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                  <div className="text-center group">
                    <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-emerald-500/50 transition-colors shadow-inner">
                      <Star className="h-10 w-10 text-emerald-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-black text-white">{reputation.breakdown.avgRating.toFixed(1)}</div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Average Rating</p>
                    <p className="text-[9px] text-gray-600 font-bold mt-2 uppercase tracking-tighter">{reputation.breakdown.totalRatings} Raw data points</p>
                  </div>

                  <div className="text-center group">
                    <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-blue-500/50 transition-colors shadow-inner">
                      <TrendingUp className="h-10 w-10 text-blue-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-black text-white">{reputation.breakdown.attendancePercentage.toFixed(1)}%</div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">Attendance Ratio</p>
                  </div>

                  <div className="text-center group">
                    <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/10 group-hover:border-rose-500/50 transition-colors shadow-inner">
                      <AlertCircle className="h-10 w-10 text-rose-500 group-hover:scale-110 transition-transform" />
                    </div>
                    <div className="text-4xl font-black text-white">{reputation.breakdown.totalComplaints}</div>
                    <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mt-1">System Alerts</p>
                  </div>
                </div>
              </div>
            )}

            {/* Asset Feedback Stream */}
            <div className="glass-card p-10 border-t border-white/10">
              <div className="flex items-center justify-between mb-10">
                <h3 className="text-2xl font-black text-white uppercase tracking-tight">Recent Feedback Stream</h3>
                <div className="h-8 w-8 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20 text-emerald-500 text-[10px] font-black">{ratings.length}</div>
              </div>

              {ratings.length > 0 ? (
                <div className="space-y-6">
                  {ratings.slice(0, 5).map(rating => (
                    <div key={rating._id} className="p-6 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-all group">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="h-8 w-8 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                            <User className="h-4 w-4 text-emerald-400" />
                          </div>
                          <span className="font-black text-white uppercase text-xs tracking-tight">{rating.customer?.name || rating.clientName || 'ANONYMOUS_QUERY'}</span>
                        </div>
                        <div className="flex items-center space-x-4">
                          <StarRating rating={rating.rating} readonly size="sm" />
                          <span className="text-[10px] font-bold text-gray-500 font-mono">{new Date(rating.date).toLocaleDateString()}</span>
                        </div>
                      </div>

                      <div className="flex mb-4">
                        <span className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-md text-[10px] font-black uppercase tracking-widest">
                          {rating.serviceType}
                        </span>
                      </div>

                      {rating.feedback && (
                        <div className="flex items-start space-x-3 p-4 bg-black/40 rounded-xl italic">
                          <MessageSquare className="h-4 w-4 text-gray-600 mt-0.5" />
                          <p className="text-sm text-gray-400 leading-relaxed font-medium">"{rating.feedback}"</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                  <Star className="h-16 w-16 text-gray-700 mx-auto mb-6" />
                  <h4 className="text-xl font-black text-gray-600 uppercase tracking-widest">Zero Intel Points</h4>
                  <p className="text-gray-600 text-[10px] font-bold mt-2 uppercase tracking-tight">No customer feedback has been detected for this asset yet.</p>
                </div>
              )}
            </div>
          </section>

          {/* Quick Command Control */}
          <aside className="space-y-8 animate-fade-in" style={{ animationDelay: '300ms' }}>
            <div className="glass-card p-8 border-t border-white/10">
              <h3 className="text-lg font-black text-white uppercase tracking-widest mb-6">Unit Commands</h3>
              <div className="space-y-3">
                <button onClick={() => navigate(`/edit-worker/${id}`)} className="w-full flex items-center justify-between p-4 bg-white text-black rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-all shadow-xl group">
                  <span>Modify Intel</span>
                  <Edit className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </button>
                {user?.role === 'customer' && (
                  <button onClick={() => navigate(`/rate-worker/${id}`)} className="w-full flex items-center justify-between p-4 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 hover:text-black transition-all group">
                    <span>Deploy Rating</span>
                    <Star className="h-4 w-4 group-hover:scale-125 transition-transform" />
                  </button>
                )}
                <button className="w-full flex items-center justify-between p-4 bg-white/5 text-gray-400 border border-white/10 rounded-2xl font-black uppercase text-[10px] tracking-widest hover:bg-white/10 hover:text-white transition-all">
                  <span>Export JSON Intel</span>
                  <Activity className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="glass-card p-8 bg-gradient-to-br from-emerald-600/20 to-transparent border-t border-white/10">
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="h-5 w-5 text-emerald-500" />
                <h3 className="text-sm font-black text-white uppercase tracking-widest">Asset Status</h3>
              </div>
              <p className="text-xs text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">Personnel asset is currently synchronized with primary node. Intelligence integrity: 100%.</p>
              <div className="mt-6 flex items-center space-x-2">
                <div className="h-1.5 flex-1 bg-white/5 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-[85%] rounded-full shadow-lg shadow-emerald-500/50" />
                </div>
                <span className="text-[10px] font-black text-emerald-500">85% OPTIMIZED</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};

export default WorkerProfile;
