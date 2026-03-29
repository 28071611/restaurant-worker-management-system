import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Eye, EyeOff, Mail, Lock, PlusCircle } from 'lucide-react';

const Login = () => {
  const navigate = useNavigate();
  const { login, error } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [formError, setFormError] = useState('');

  // Keyboard shortcut for Admin Login (Unit VIII - Event Handling)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'A') {
        e.preventDefault();
        navigate('/admin-login');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setFormError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.email || !formData.password) {
      setFormError('Please fill in all fields');
      return;
    }

    const result = await login(formData.email, formData.password);

    if (result.success) {
      // Redirect based on user role
      const userRole = JSON.parse(atob(localStorage.getItem('token').split('.')[1])).role;
      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/customer/dashboard');
      }
    } else {
      setFormError(result.message);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-cover bg-center bg-no-repeat relative"
      style={{ backgroundImage: 'url("/background.png")' }}
    >
      {/* Dark overlay for better readability */}
      <div className="absolute inset-0 bg-black/60" />

      <div className="max-w-md w-full space-y-8 relative z-10 backdrop-blur-xl bg-white/10 p-8 rounded-2xl border border-white/20 shadow-2xl">
        <div>
          <div className="mx-auto h-16 w-16 flex items-center justify-center rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-600 shadow-lg shadow-amber-500/20">
            <Lock className="h-8 w-8 text-white" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-white tracking-tight">
            Restaurant Management
          </h2>
          <p className="mt-2 text-center text-sm text-gray-300">
            Sign in to your premium workspace
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="email" className="sr-only font-medium text-gray-200">
                Email address
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none relative block w-full pl-10 pr-3 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all sm:text-sm"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="sr-only font-medium text-gray-200">
                Password
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-amber-500 transition-colors" />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  className="appearance-none relative block w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 placeholder-gray-400 text-white rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all sm:text-sm"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  ) : (
                    <Eye className="h-5 w-5 text-gray-400 hover:text-white transition-colors" />
                  )}
                </button>
              </div>
            </div>
          </div>

          {(formError || error) && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-3 animate-pulse">
              <p className="text-sm text-red-400 text-center font-medium">{formError || error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-gradient-to-r from-amber-600 to-yellow-600 hover:from-amber-500 hover:to-yellow-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-black focus:ring-amber-500 transition-all shadow-lg shadow-amber-600/20 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-wider"
            >
              {loading ? (
                <div className="flex items-center space-x-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  <span>Authenticating...</span>
                </div>
              ) : (
                'Sign in'
              )}
            </button>
          </div>

          <div className="flex flex-col space-y-4 pt-4 border-t border-white/10">
            <Link
              to="/register"
              className="group relative w-full flex justify-center py-3 px-4 border border-white/20 text-sm font-bold rounded-xl text-white bg-white/5 hover:bg-white/10 transition-all shadow-lg"
            >
              <div className="flex items-center space-x-2">
                <PlusCircle className="h-4 w-4 text-amber-500" />
                <span>Create New Account</span>
              </div>
            </Link>

            <div className="flex items-center justify-between px-2">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                Admin access: <span className="text-gray-400">Ctrl+Shift+A</span>
              </span>
              <Link to="/admin-login" className="text-[10px] text-gray-500 hover:text-amber-500 transition-colors uppercase tracking-widest font-bold">
                Manual Login
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
