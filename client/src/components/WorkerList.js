import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees } from '../utils/currencyUtils';
import {
  Search,
  Filter,
  ArrowUpDown,
  Edit,
  Trash2,
  Plus,
  DollarSign,
  Clock,
  Phone,
  Eye,
  Briefcase,
  Activity
} from 'lucide-react';

const WorkerList = () => {
  const navigate = useNavigate();
  const {
    workers,
    loading,
    deleteWorker,
    getUniqueRoles
  } = React.useContext(WorkerContext);

  const [filteredWorkers, setFilteredWorkers] = useState(workers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    const applyFiltersLocal = () => {
      let result = [...workers];

      // Search filter
      if (searchQuery.trim() !== '') {
        result = result.filter(worker =>
          worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
          worker.phone.includes(searchQuery)
        );
      }

      // Role filter
      if (selectedRole !== 'All') {
        result = result.filter(worker => worker.role === selectedRole);
      }

      // Sorting
      result.sort((a, b) => {
        let aVal = a[sortBy];
        let bVal = b[sortBy];

        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (sortOrder === 'asc') {
          return aVal > bVal ? 1 : -1;
        } else {
          return aVal < bVal ? 1 : -1;
        }
      });

      setFilteredWorkers(result);
    };

    applyFiltersLocal();
  }, [workers, searchQuery, selectedRole, sortBy, sortOrder]);

  const handleDelete = async (id) => {
    const result = await deleteWorker(id);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  const WorkerCard = ({ worker }) => {
    const isMatched = searchQuery.trim() !== '' && (
      worker.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      worker.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
      <div className={`glass-card p-6 flex flex-col justify-between h-full group animate-fade-in relative overflow-hidden transition-all duration-500 ${
        isMatched ? 'border-emerald-500/50 glow-pulse scale-[1.02]' : ''
      }`}>
      <div className={`absolute top-0 right-0 h-24 w-24 bg-gradient-to-br ${worker.status === 'Active' ? 'from-emerald-500/20' : 'from-amber-500/20'} to-transparent opacity-0 group-hover:opacity-100 transition-opacity blur-2xl`} />

      <div>
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <div className="h-16 w-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center overflow-hidden shadow-inner group-hover:border-emerald-500/50 transition-colors">
                {worker.employeeImage?.filename ? (
                  <img src={`/uploads/${worker.employeeImage.filename}`} className="h-full w-full object-cover" alt="" />
                ) : (
                  <span className="text-2xl font-black text-white/20 group-hover:text-emerald-500 transition-colors">{worker.name.charAt(0)}</span>
                )}
              </div>
              <div className={`absolute -bottom-1 -right-1 h-4 w-4 rounded-full border-2 border-black ${worker.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white tracking-tight uppercase group-hover:text-emerald-400 transition-colors">{worker.name}</h3>
              <p className="text-emerald-500 text-xs font-black uppercase tracking-widest leading-none mt-1">{worker.role}</p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Contact</span>
            </div>
            <span className="text-sm font-mono text-white tracking-tighter">+91 {worker.phone}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Payroll</span>
            </div>
            <span className="text-sm font-black text-emerald-400">{formatIndianRupees(worker.salary)}</span>
          </div>

          <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
            <div className="flex items-center space-x-2">
              <Clock className="h-4 w-4 text-emerald-500" />
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">Shift</span>
            </div>
            <span className="text-xs font-black text-white uppercase">{worker.shift}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center space-x-2 pt-4 border-t border-white/5">
        <button
          onClick={() => navigate(`/worker/${worker._id}`)}
          className="flex-1 flex items-center justify-center space-x-2 py-2.5 bg-white/5 hover:bg-white/10 text-white rounded-xl transition-all border border-white/10"
        >
          <Eye className="h-4 w-4" />
          <span className="text-[10px] font-black uppercase tracking-widest">Intel</span>
        </button>
        <button
          onClick={() => navigate(`/edit-worker/${worker._id}`)}
          className="p-2.5 bg-white/5 hover:bg-emerald-500 text-white hover:text-black rounded-xl transition-all border border-white/10"
        >
          <Edit className="h-4 w-4" />
        </button>
        <button
          onClick={() => setDeleteConfirm(worker._id)}
          className="p-2.5 bg-white/5 hover:bg-rose-500 text-white rounded-xl transition-all border border-white/10"
        >
          <Trash2 className="h-4 w-4" />
        </button>
      </div>

      {deleteConfirm === worker._id && (
        <div className="absolute inset-x-0 bottom-0 p-6 bg-black/90 backdrop-blur-md rounded-b-[1.5rem] border-t border-rose-500/50 animate-fade-in">
          <p className="text-xs font-black text-rose-500 uppercase tracking-widest mb-4">Confirm Deletion?</p>
          <div className="flex space-x-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="flex-1 py-2 bg-white/10 text-white text-[10px] font-black uppercase rounded-lg"
            >
              Abort
            </button>
            <button
              onClick={() => handleDelete(worker._id)}
              className="flex-1 py-2 bg-rose-600 text-white text-[10px] font-black uppercase rounded-lg shadow-lg shadow-rose-600/20"
            >
              Destroy
            </button>
          </div>
        </div>
      )}
    </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black relative text-white pb-20">
      {/* Background Image with Overlay */}
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: 'url("/background.png")' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 pt-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8 animate-fade-in">
          <div>
            <h1 className="text-5xl font-black text-white tracking-tighter uppercase mb-2">Personnel Assets</h1>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
                <Activity className="h-3 w-3 text-emerald-500" />
                <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{workers.length} Total Units</span>
              </div>
              <div className="flex items-center space-x-1.5 px-3 py-1 bg-blue-500/10 border border-blue-500/20 rounded-full">
                <Briefcase className="h-3 w-3 text-blue-500" />
                <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{getUniqueRoles().length} Specialties</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/add-worker')}
            className="group flex items-center space-x-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-xs tracking-[0.2em] rounded-2xl transition-all shadow-2xl shadow-emerald-500/20"
          >
            <Plus className="h-5 w-5 group-hover:rotate-90 transition-transform" />
            <span>Recruit New Asset</span>
          </button>
        </div>

        {/* Global Control Terminal */}
        <div className="glass-card p-6 flex flex-col lg:flex-row gap-4 lg:items-center animate-fade-in" style={{ animationDelay: '100ms' }}>
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50 group-focus-within:text-emerald-400 transition-colors" />
            <input
              type="text"
              placeholder="Query Asset Metadata (Name, Role, ID)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-sm font-bold placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 transition-all uppercase tracking-tight"
            />
          </div>

          <div className="flex gap-4">
            <div className="relative group">
              <Filter className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
              <select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
                className="pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest appearance-none focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value="All" className="bg-neutral-900">All Units</option>
                {getUniqueRoles().map(role => (
                  <option key={role} value={role} className="bg-neutral-900">{role}</option>
                ))}
              </select>
            </div>

            <div className="relative group">
              <ArrowUpDown className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-emerald-500/50" />
              <select
                value={`${sortBy}-${sortOrder}`}
                onChange={(e) => {
                  const [field, order] = e.target.value.split('-');
                  setSortBy(field);
                  setSortOrder(order);
                }}
                className="pl-12 pr-10 py-4 bg-white/5 border border-white/10 rounded-2xl text-white text-xs font-black uppercase tracking-widest appearance-none focus:outline-none focus:border-emerald-500/50 cursor-pointer"
              >
                <option value="name-asc" className="bg-neutral-900">Sort: Name [A-Z]</option>
                <option value="name-desc" className="bg-neutral-900">Sort: Name [Z-A]</option>
                <option value="salary-desc" className="bg-neutral-900">Sort: Payroll [High]</option>
                <option value="salary-asc" className="bg-neutral-900">Sort: Payroll [Low]</option>
              </select>
            </div>
          </div>
        </div>

        {/* Assets Grid */}
        {filteredWorkers.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-fade-in" style={{ animationDelay: '200ms' }}>
            {filteredWorkers.map(worker => (
              <WorkerCard key={worker._id} worker={worker} />
            ))}
          </div>
        ) : (
          <div className="glass-card py-32 text-center animate-fade-in">
            <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-white/10">
              <Search className="h-10 w-10 text-gray-500" />
            </div>
            <h3 className="text-2xl font-black text-white uppercase tracking-tighter">No Units Detected</h3>
            <p className="text-gray-500 text-sm mt-2 font-medium">No personnel assets match your current filter parameters.</p>
            <button
              onClick={() => { setSearchQuery(''); setSelectedRole('All'); }}
              className="mt-8 px-8 py-3 bg-white/5 hover:bg-white/10 text-white text-[10px] font-black uppercase tracking-widest rounded-xl border border-white/10 transition-all"
            >
              Reset Terminal Query
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default WorkerList;
