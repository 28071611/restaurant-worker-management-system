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
    Star
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

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div>
            </div>
        );
    }

    if (!workerData) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Worker profile not found.</p>
            </div>
        );
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
            <div className="relative overflow-hidden rounded-3xl bg-neutral-900 p-8 shadow-2xl border border-white/10">
                <div className="absolute top-0 right-0 -m-8 h-48 w-48 rounded-full bg-amber-500/10 blur-3xl"></div>
                <div className="absolute bottom-0 left-0 -m-8 h-48 w-48 rounded-full bg-yellow-500/5 blur-3xl"></div>

                <div className="relative flex flex-col md:flex-row items-center gap-8">
                    <div className="relative">
                        <div className="h-32 w-32 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 p-1">
                            <div className="h-full w-full rounded-2xl bg-neutral-900 flex items-center justify-center overflow-hidden">
                                {workerData.employeeImage ? (
                                    <img
                                        src={workerData.employeeImage.path}
                                        alt={workerData.name}
                                        className="h-full w-full object-cover"
                                    />
                                ) : (
                                    <User className="h-16 w-16 text-amber-500/50" />
                                )}
                            </div>
                        </div>
                        <div className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-green-500 border-4 border-neutral-900 flex items-center justify-center" title="Active">
                            <div className="h-2 w-2 rounded-full bg-white animate-pulse"></div>
                        </div>
                    </div>

                    <div className="text-center md:text-left flex-1">
                        <h1 className="text-4xl font-black text-white tracking-tight">{workerData.name}</h1>
                        <p className="text-amber-500 font-bold uppercase tracking-widest text-sm mt-1">
                            {workerData.role} • {workerData.department}
                        </p>
                        <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-4">
                            <span className="flex items-center gap-2 text-gray-400 text-sm">
                                <Mail className="h-4 w-4 text-amber-500" />
                                {workerData.email}
                            </span>
                            <span className="flex items-center gap-2 text-gray-400 text-sm">
                                <Phone className="h-4 w-4 text-amber-500" />
                                {workerData.phone}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-blue-500/10 rounded-xl">
                            <Banknote className="h-6 w-6 text-blue-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Monthly Salary</p>
                            <p className="text-2xl font-black text-white">₹{workerData.salary.toLocaleString()}</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-emerald-500/10 rounded-xl">
                            <Clock className="h-6 w-6 text-emerald-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Current Shift</p>
                            <p className="text-2xl font-black text-white">{workerData.shift}</p>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-6 rounded-2xl">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-purple-500/10 rounded-xl">
                            <Award className="h-6 w-6 text-purple-500" />
                        </div>
                        <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-widest">Experience</p>
                            <p className="text-2xl font-black text-white">{workerData.experience} Years</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-amber-500" />
                            Performance Summary
                        </h2>
                    </div>
                    <div className="space-y-6">
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Attendance</span>
                                <span className="text-amber-500 font-bold">98%</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '98%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Service Rating</span>
                                <span className="text-amber-500 font-bold">4.8/5.0</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '96%' }}></div>
                            </div>
                        </div>
                        <div>
                            <div className="flex justify-between text-sm mb-2">
                                <span className="text-gray-400">Tasks Completed</span>
                                <span className="text-amber-500 font-bold">245</span>
                            </div>
                            <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                                <div className="h-full bg-amber-500" style={{ width: '85%' }}></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="backdrop-blur-xl bg-white/5 border border-white/10 p-8 rounded-3xl flex flex-col items-center justify-center text-center">
                    <div className="h-20 w-20 bg-amber-500/10 rounded-full flex items-center justify-center mb-4">
                        <Star className="h-10 w-10 text-amber-500 animate-pulse" />
                    </div>
                    <h3 className="text-2xl font-black text-white italic">"Excellence redefined."</h3>
                    <p className="text-gray-400 text-sm mt-4">
                        You've been consistently performing above average. Keep up the high standards to qualify for the next bonus cycle!
                    </p>
                    <div className="mt-8 px-6 py-2 bg-amber-500 rounded-full font-bold text-black text-sm uppercase tracking-widest shadow-lg shadow-amber-500/20">
                        Top Rated Worker
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WorkerPortal;
