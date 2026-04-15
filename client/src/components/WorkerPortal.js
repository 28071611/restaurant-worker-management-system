import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import {
    User,
    Mail,
    Phone,
    Award,
    Calendar,
    Banknote,
    Clock,
    Briefcase,
    TrendingUp,
    Star,
    Activity,
    Shield,
    ArrowRight,
    Trophy,
    Target,
    Zap,
    AlertCircle
} from 'lucide-react';

const WorkerPortal = () => {
    const { user } = useAuth();
    const [workerData, setWorkerData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMyData = async () => {
            try {
                const response = await axios.get('/api/workers/me');
                setWorkerData(response.data.data);
            } catch (error) {
                console.error('Failed to fetch worker data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMyData();
    }, []);

    const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
        <div className="glass-card p-6 flex items-center justify-between relative overflow-hidden group border-t border-white/5">
            <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${color} opacity-0 group-hover:opacity-10 transition-opacity blur-2xl`} />
            <div className="relative z-10">
                <p className="text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] mb-1">{title}</p>
                <p className="text-3xl font-black text-white tracking-tighter">{value}</p>
                <p className="text-[9px] font-bold text-gray-600 uppercase tracking-widest mt-1">{subtitle}</p>
            </div>
            <div className={`h-12 w-12 rounded-xl bg-gradient-to-tr ${color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300 border border-white/10`}>
                <Icon className="h-6 w-6 text-white" />
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

    if (!workerData) {
        return (
            <div className="min-h-screen bg-black flex items-center justify-center text-center p-4">
                <div className="glass-card p-10 max-w-md border-rose-500/20">
                    <AlertCircle className="h-16 w-16 text-rose-500 mx-auto mb-6" />
                    <h2 className="text-2xl font-black text-white uppercase tracking-tighter">Profile Sync Error</h2>
                    <p className="text-gray-500 text-sm font-medium mt-2">Operational identity not found in central database. Contact system overseer.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative text-white pb-20 overflow-hidden">
            {/* Background decoration */}
            <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/90 to-black" />
            <div className="fixed top-0 left-0 h-[600px] w-[600px] bg-emerald-500/5 blur-[120px] rounded-full -ml-64 -mt-64" />
            <div className="fixed bottom-0 right-0 h-[600px] w-[600px] bg-amber-500/5 blur-[120px] rounded-full -mr-64 -mb-64" />

            <div className="relative z-10 max-w-6xl mx-auto px-4 pt-10 space-y-12">
                {/* Profile Header */}
                <div className="glass-card p-10 border-t border-white/10 relative overflow-hidden group animate-fade-in">
                    <div className="absolute top-0 right-0 h-64 w-64 bg-emerald-500/5 blur-[80px] group-hover:bg-emerald-500/10 transition-all duration-700" />
                    
                    <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                        <div className="relative">
                            <div className="h-40 w-40 rounded-3xl bg-gradient-to-tr from-emerald-500 to-green-400 p-1 shadow-2xl">
                                <div className="h-full w-full rounded-3xl bg-black flex items-center justify-center overflow-hidden border border-white/10">
                                    {workerData.employeeImage ? (
                                        <img
                                            src={workerData.employeeImage.path}
                                            alt={workerData.name}
                                            className="h-full w-full object-cover"
                                        />
                                    ) : (
                                        <span className="text-6xl font-black text-emerald-500/20">{workerData.name.charAt(0)}</span>
                                    )}
                                </div>
                            </div>
                            <div className="absolute -bottom-2 -right-2 h-10 w-10 rounded-2xl bg-black border border-emerald-500/30 flex items-center justify-center shadow-2xl">
                                <div className="h-3 w-3 rounded-full bg-emerald-500 animate-pulse"></div>
                            </div>
                        </div>

                        <div className="text-center md:text-left flex-1 space-y-4">
                            <div>
                                <div className="flex flex-wrap items-center justify-center md:justify-start gap-3 mb-2">
                                    <h1 className="text-5xl font-black text-white tracking-tighter uppercase leading-none">{workerData.name}</h1>
                                    <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[10px] font-black text-emerald-500 uppercase tracking-widest">Active Duty</span>
                                </div>
                                <p className="text-emerald-500 font-black uppercase tracking-[0.3em] text-xs">
                                    Personnel Unit • {workerData.role} • {workerData.department}
                                </p>
                            </div>

                            <div className="flex flex-wrap justify-center md:justify-start gap-6 border-t border-white/5 pt-6">
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                        <Mail className="h-4 w-4 text-emerald-500/50" />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">{workerData.email}</span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="h-8 w-8 bg-white/5 rounded-lg flex items-center justify-center border border-white/10">
                                        <Phone className="h-4 w-4 text-emerald-500/50" />
                                    </div>
                                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-tight">+91 {workerData.phone}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Logistics Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-in" style={{ animationDelay: '100ms' }}>
                    <StatCard
                        title="Monthly Asset Flow"
                        value={`₹${workerData.salary.toLocaleString()}`}
                        icon={Banknote}
                        color="from-blue-600 to-indigo-400"
                        subtitle="Salary Synchronization"
                    />
                    <StatCard
                        title="Operational Cycle"
                        value={workerData.shift}
                        icon={Clock}
                        color="from-emerald-600 to-green-400"
                        subtitle="Current Active Shift"
                    />
                    <StatCard
                        title="Service Seniority"
                        value={`${workerData.experience}Y`}
                        icon={Award}
                        color="from-purple-600 to-pink-400"
                        subtitle="Operational Tenure"
                    />
                </div>

                {/* Performance Intelligence */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
                    <div className="glass-card p-10 border-t border-white/10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 h-48 w-48 bg-emerald-500/5 blur-[60px] group-hover:bg-emerald-500/10 transition-all duration-700" />
                        <div className="flex items-center justify-between mb-10 relative z-10">
                            <h2 className="text-2xl font-black text-white flex items-center gap-3 uppercase tracking-tight">
                                <TrendingUp className="h-6 w-6 text-emerald-500" />
                                Performance Intel
                            </h2>
                            <Activity className="h-6 w-6 text-emerald-500/30" />
                        </div>
                        
                        <div className="space-y-10 relative z-10">
                            {[
                                { label: 'Operational Attendance', val: '98%', icon: Calendar, color: 'emerald' },
                                { label: 'Service Quality Index', val: '4.8/5.0', icon: Star, color: 'amber' },
                                { label: 'Task Execution Rate', val: '245', icon: Target, color: 'blue' }
                            ].map((stat, i) => (
                                <div key={i} className="space-y-3">
                                    <div className="flex justify-between items-center px-1">
                                        <div className="flex items-center gap-2">
                                            <stat.icon className="h-3 w-3 text-gray-500" />
                                            <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{stat.label}</span>
                                        </div>
                                        <span className={`text-[11px] font-black text-${stat.color}-500 uppercase tracking-tight`}>{stat.val}</span>
                                    </div>
                                    <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/5">
                                        <div 
                                            className={`h-full bg-${stat.color}-500 rounded-full shadow-[0_0_10px_rgba(0,255,100,0.3)]`} 
                                            style={{ width: i === 0 ? '98%' : i === 1 ? '96%' : '85%' }}
                                        ></div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="glass-card p-10 border-t border-amber-500/30 relative overflow-hidden group bg-gradient-to-br from-amber-500/5 to-transparent flex flex-col items-center justify-center text-center">
                        <div className="absolute -top-10 -right-10 h-40 w-40 bg-amber-500/10 blur-[50px] rounded-full group-hover:scale-125 transition-transform duration-700" />
                        <div className="h-24 w-24 bg-amber-500/10 rounded-full flex items-center justify-center mb-8 border border-amber-500/30 shadow-2xl group-hover:rotate-[360deg] transition-transform duration-1000">
                            <Zap className="h-10 w-10 text-amber-500 fill-amber-500 animate-pulse" />
                        </div>
                        <h3 className="text-3xl font-black text-white italic uppercase tracking-tighter mb-4">"Operational Excellence"</h3>
                        <p className="text-gray-500 text-sm font-medium max-w-sm leading-relaxed mb-8">
                            Unit synchronized successfully. Performance metrics indicate high asset efficiency. Qualification for future bonus protocol is optimized.
                        </p>
                        <div className="px-8 py-3 bg-white text-black rounded-xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-emerald-500 transition-colors">
                            Apex Status Verified
                        </div>
                    </div>
                </div>

                {/* Footer Protocols */}
                <div className="flex items-center justify-between px-6 opacity-30 animate-fade-in" style={{ animationDelay: '400ms' }}>
                    <div className="flex items-center gap-4">
                        <Shield className="h-4 w-4" />
                        <span className="text-[9px] font-black uppercase tracking-widest">Secure Terminal Link</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-[9px] font-black uppercase tracking-widest">Protocol ID: {workerData._id.toUpperCase()}</span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerPortal;
