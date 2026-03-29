import React from 'react';
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
  ClipboardList
} from 'lucide-react';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated, isAdmin, isCustomer } = useAuth();

  const getNavItems = () => {
    if (!isAuthenticated) return [];

    if (isAdmin) {
      return [
        { path: '/admin/dashboard', label: 'Admin Panel', icon: LayoutDashboard },
        { path: '/workers', label: 'All Workers', icon: Users },
        { path: '/add-worker', label: 'Add Staff', icon: Plus },
        { path: '/analytics', label: 'Analytics', icon: BarChart3 },
        { path: '/reputation', label: 'Reputation', icon: Award },
      ];
    }

    if (user?.role === 'worker') {
      return [
        { path: '/worker/portal', label: 'My Progress', icon: User },
        { path: '/reputation', label: 'Leaderboard', icon: Trophy },
      ];
    }

    // Default: Customer
    return [
      { path: '/customer/dashboard', label: 'My Dashboard', icon: LayoutDashboard },
      { path: '/rate-worker', label: 'Rate Workers', icon: Star },
      { path: '/file-complaint', label: 'Complaints', icon: MessageSquare },
      { path: '/reviews', label: 'Reviews', icon: ClipboardList },
    ];
  };

  const navItems = getNavItems();

  if (!isAuthenticated) return null; // Hide navbar on login/register pages if preferred, or show minimal logo

  return (
    <nav className="bg-white/80 backdrop-blur-md sticky top-0 z-50 shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-tr from-amber-500 to-yellow-600 p-1.5 rounded-lg shadow-sm">
              <Utensils className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">
              Restaurant Manager
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${isActive
                      ? 'bg-amber-50 text-amber-700 shadow-sm scale-105'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-amber-600'
                    }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="text-sm font-semibold">{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="flex items-center space-x-4">
            <div className="hidden sm:flex flex-col items-end mr-2">
              <span className="text-xs font-bold text-gray-900">{user?.name}</span>
              <span className="text-[10px] text-amber-600 uppercase tracking-tighter font-extrabold">{user?.role}</span>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="p-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all duration-300 group"
              title="Logout"
            >
              <LogOut className="h-5 w-5 group-hover:rotate-12 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
