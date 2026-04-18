import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import WorkerList from './components/WorkerList';
import AddWorker from './components/AddWorker';
import EditWorker from './components/EditWorker';
import Analytics from './components/Analytics';
import RatingForm from './components/RatingForm';
import ReputationDashboard from './components/ReputationDashboard';
import WorkerProfile from './components/WorkerProfile';
import Login from './components/Login';
import Register from './components/Register';
import AdminLogin from './components/AdminLogin';
import AdminDashboard from './components/AdminDashboard';
import CustomerDashboard from './components/CustomerDashboard';
import ComplaintForm from './components/ComplaintForm';
import DatasetSeeder from './components/DatasetSeeder';
import KeyboardShortcuts from './components/KeyboardShortcuts';
import ProtectedRoute from './components/ProtectedRoute';
import Unauthorized from './components/Unauthorized';
import { AuthProvider, useAuth } from './context/AuthContext';
import { WorkerProvider } from './context/WorkerContext';
import WorkerPortal from './components/WorkerPortal';
import Reviews from './components/Reviews';
import './App.css';

// Home Redirect Component
const HomeRedirect = () => {
  const { isAuthenticated, user, loading } = useAuth();

  if (loading) return <div className="flex bg-black items-center justify-center min-h-screen"><div className="animate-spin rounded-full h-12 w-12 border-t-2 border-amber-500"></div></div>;

  if (!isAuthenticated) return <Login />;

  if (user?.role === 'admin') return <Navigate to="/admin/dashboard" replace />;
  if (user?.role === 'worker') return <Navigate to="/worker/portal" replace />;
  return <Navigate to="/customer/dashboard" replace />;
};

function App() {
  return (
    <AuthProvider>
      <WorkerProvider>
        <Router>
          <div className="min-h-screen bg-black transition-colors duration-500">
            <KeyboardShortcuts />
            <Navbar />
            <main className="container mx-auto px-4 py-8 pt-24">
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomeRedirect />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/admin-login" element={<AdminLogin />} />
                <Route path="/unauthorized" element={<Unauthorized />} />
                <Route path="/seed-database" element={<DatasetSeeder />} />
                <Route path="/reviews" element={<Reviews />} />

                {/* Worker Protected Routes */}
                <Route path="/worker/portal" element={
                  <ProtectedRoute requiredRole="worker">
                    <WorkerPortal />
                  </ProtectedRoute>
                } />

                {/* Customer Protected Routes */}
                <Route path="/customer/dashboard" element={
                  <ProtectedRoute requiredRole="customer">
                    <CustomerDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/rate-worker" element={
                  <ProtectedRoute requiredRole="customer">
                    <RatingForm />
                  </ProtectedRoute>
                } />
                <Route path="/rate-worker/:id" element={
                  <ProtectedRoute requiredRole="customer">
                    <RatingForm />
                  </ProtectedRoute>
                } />
                <Route path="/file-complaint" element={
                  <ProtectedRoute requiredRole="customer">
                    <ComplaintForm />
                  </ProtectedRoute>
                } />
                <Route path="/worker/:id" element={
                  <ProtectedRoute requiredRole={['admin', 'customer', 'worker']}>
                    <WorkerProfile />
                  </ProtectedRoute>
                } />

                {/* Admin Protected Routes */}
                <Route path="/admin/dashboard" element={
                  <ProtectedRoute requiredRole="admin">
                    <AdminDashboard />
                  </ProtectedRoute>
                } />
                <Route path="/workers" element={
                  <ProtectedRoute requiredRole="admin">
                    <WorkerList />
                  </ProtectedRoute>
                } />
                <Route path="/add-worker" element={
                  <ProtectedRoute requiredRole="admin">
                    <AddWorker />
                  </ProtectedRoute>
                } />
                <Route path="/edit-worker/:id" element={
                  <ProtectedRoute requiredRole="admin">
                    <EditWorker />
                  </ProtectedRoute>
                } />
                <Route path="/analytics" element={
                  <ProtectedRoute requiredRole="admin">
                    <Analytics />
                  </ProtectedRoute>
                } />
                <Route path="/reputation" element={
                  <ProtectedRoute requiredRole="admin">
                    <ReputationDashboard />
                  </ProtectedRoute>
                } />
              </Routes>
            </main>
          </div>
        </Router>
      </WorkerProvider>
    </AuthProvider>
  );
}

export default App;
