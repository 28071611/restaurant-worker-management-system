import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Utensils,
  Users,
  Plus,
  BarChart3,
  Home,
  Star,
  Award,
  LogOut,
  User,
  LayoutDashboard,
  MessageSquare,
  ClipboardList,
  Trophy,
  Menu,
  X,
  Shield,
  Activity
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const getNavItems = () => {
    if (!isAuthenticated) return [];

    if (isAdmin) {
      return [
        { path: '/admin/dashboard', label: 'Admin Panel', icon: LayoutDashboard },
        { path: '/workers', label: 'Personnel List', icon: Users },
        { path: '/add-worker', label: 'Recruit', icon: Plus },
        { path: '/analytics', label: 'Intelligence', icon: BarChart3 },
        { path: '/reputation', label: 'Reputation', icon: Trophy },
      ];
    }

    if (user?.role === 'worker') {
      return [
        { path: '/worker/portal', label: 'My Terminal', icon: User },
        { path: '/reputation', label: 'Leaderboard', icon: Trophy },
      ];
    }

    // Default: Customer
    return [
      { path: '/customer/dashboard', label: 'Guest Hub', icon: LayoutDashboard },
      { path: '/rate-worker', label: 'Rate Staff', icon: Star },
      { path: '/file-complaint', label: 'Log Incident', icon: MessageSquare },
      { path: '/reviews', label: 'Review Logs', icon: ClipboardList },
    ];
  };

  const navItems = getNavItems();

  if (!isAuthenticated) return null;

  return (
    <nav className="fixed top-0 left-0 right-0 z-[100] bg-black/40 backdrop-blur-2xl border-b border-white/5 h-20 flex items-center shadow-2xl">
      <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
        <div className="flex items-center justify-between">
          {/* Logo Section */}
          <Link to="/" className="flex items-center space-x-3 group translate-z-0">
            <div className="bg-gradient-to-tr from-emerald-600 to-green-400 p-2 rounded-xl shadow-2xl group-hover:scale-110 transition-transform duration-500 border border-white/20">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <div className="flex flex-col">
               <span className="text-xl font-black text-white tracking-tighter uppercase leading-none italic group-hover:text-emerald-400 transition-colors">
                StaffMaster
              </span>
              <span className="text-[8px] font-black text-emerald-500 uppercase tracking-[0.4em] leading-none mt-1">
                Advanced Systems
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-6 py-3 rounded-xl transition-all duration-300 relative group overflow-hidden ${
                    isActive
                      ? 'bg-white/5 text-emerald-400 border border-white/5'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Icon className={`h-4 w-4 transition-transform duration-300 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`} />
                  <span className="text-[10px] font-black uppercase tracking-widest leading-none">{item.label}</span>
                  {isActive && (
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 h-0.5 w-6 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* User & Actions */}
          <div className="flex items-center space-x-6">
            <div className="hidden sm:flex items-center space-x-4 border-l border-white/10 pl-6 h-10">
              <div className="text-right">
                <p className="text-[10px] font-black text-white uppercase tracking-tight">{user?.name}</p>
                <p className="text-[8px] font-bold text-emerald-500 uppercase tracking-widest italic">{user?.role} Unit</p>
              </div>
              <div className="h-10 w-10 bg-gradient-to-tr from-emerald-600/20 to-green-400/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
                 <User className="h-5 w-5 text-emerald-500" />
              </div>
            </div>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-3 glass-card hover:bg-rose-500/10 text-gray-500 hover:text-rose-500 transition-all group border-white/5"
              title="Terminate Session"
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            </button>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-3 glass-card text-white border-white/5"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-20 z-[90] bg-black/90 backdrop-blur-3xl animate-fade-in p-8 space-y-6">
           <div className="grid grid-cols-1 gap-4">
             {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center space-x-6 p-6 glass-card border-white/5 hover:border-emerald-500/30 group"
                >
                   <item.icon className="h-6 w-6 text-emerald-500" />
                   <span className="text-lg font-black text-white uppercase tracking-tighter">{item.label}</span>
                </Link>
             ))}
           </div>
           
           <div className="mt-12 p-8 glass-card border-emerald-500/20 bg-emerald-500/5">
              <div className="flex items-center space-x-6">
                 <div className="h-16 w-16 rounded-2xl bg-emerald-500 flex items-center justify-center">
                    <span className="text-2xl font-black text-black">{user?.name?.charAt(0)}</span>
                 </div>
                 <div>
                    <p className="text-xl font-black text-white uppercase tracking-tighter">{user?.name}</p>
                    <p className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">{user?.role} Unit Access Granted</p>
                 </div>
              </div>
           </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
