import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { WorkerContext } from '../context/WorkerContext';
import { 
  MessageSquare, 
  AlertTriangle, 
  ArrowLeft, 
  Send,
  User
} from 'lucide-react';

const ComplaintForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { workers } = React.useContext(WorkerContext);
  
  const [formData, setFormData] = useState({
    workerId: '',
    complaint: '',
    severity: 'Medium',
    clientName: user?.name || '',
    clientEmail: user?.email || ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const severityLevels = ['Low', 'Medium', 'High', 'Critical'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.complaint.trim()) {
      setError('Please describe your complaint');
      return false;
    }

    if (formData.complaint.length < 10) {
      setError('Complaint must be at least 10 characters long');
      return false;
    }

    if (formData.complaint.length > 500) {
      setError('Complaint must be less than 500 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/complaints', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Complaint filed successfully! We will address your concerns promptly.');
        setFormData({
          workerId: '',
          complaint: '',
          severity: 'Medium',
          clientName: user?.name || '',
          clientEmail: user?.email || ''
        });
        
        // Redirect after 2 seconds
        setTimeout(() => {
          navigate('/customer/dashboard');
        }, 2000);
      } else {
        setError(data.message || 'Failed to file complaint');
      }
    } catch (err) {
      setError('Failed to submit complaint. Please try again.');
    }

    setLoading(false);
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Low': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200';
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="max-w-2xl mx-auto animate-fade-in">
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">File Complaint</h1>
          <p className="text-gray-600 mt-1">We take your feedback seriously</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                <p className="text-red-800">{error}</p>
              </div>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Send className="h-5 w-5 text-green-600" />
                <p className="text-green-800">{success}</p>
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                <span>Worker (Optional)</span>
              </label>
              <select
                name="workerId"
                value={formData.workerId}
                onChange={handleChange}
                className="input-field"
              >
                <option value="">General Complaint (Not specific to any worker)</option>
                {workers.map(worker => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name} - {worker.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span>Complaint Details *</span>
              </label>
              <textarea
                name="complaint"
                value={formData.complaint}
                onChange={handleChange}
                placeholder="Please describe your complaint in detail..."
                rows={6}
                className="input-field resize-none"
                required
              />
              <div className="flex justify-between items-center mt-1">
                <p className="text-xs text-gray-500">
                  Please provide as much detail as possible to help us address your concern
                </p>
                <p className="text-xs text-gray-500">
                  {formData.complaint.length}/500 characters
                </p>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Severity Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                {severityLevels.map(level => (
                  <label key={level} className="cursor-pointer">
                    <input
                      type="radio"
                      name="severity"
                      value={level}
                      checked={formData.severity === level}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <div className={`p-3 rounded-lg border-2 text-center transition-colors ${
                      formData.severity === level
                        ? getSeverityColor(level)
                        : 'bg-white border-gray-200 hover:border-gray-300'
                    }`}>
                      <p className="font-medium text-sm">{level}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <User className="h-4 w-4" />
                  <span>Your Name</span>
                </label>
                <input
                  type="text"
                  name="clientName"
                  value={formData.clientName}
                  onChange={handleChange}
                  placeholder="Your name"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                  <MessageSquare className="h-4 w-4" />
                  <span>Your Email</span>
                </label>
                <input
                  type="email"
                  name="clientEmail"
                  value={formData.clientEmail}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className="input-field"
                  required
                />
              </div>
            </div>
          </div>

          {/* Important Information */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Important Information</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Your complaint will be reviewed within 24 hours</li>
              <li>• We will take appropriate action based on the severity</li>
              <li>• You will receive updates on the resolution process</li>
              <li>• All complaints are handled confidentially</li>
            </ul>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/customer/dashboard')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Send className="h-4 w-4" />
              <span>{loading ? 'Submitting...' : 'File Complaint'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Contact Information */}
      <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded-lg">
        <h4 className="font-medium text-gray-900 mb-2">Need Immediate Assistance?</h4>
        <p className="text-sm text-gray-600 mb-2">
          For urgent matters, please contact our management directly:
        </p>
        <div className="text-sm text-gray-700 space-y-1">
          <p>📞 Phone: +91 98765 43210</p>
          <p>📧 Email: manager@restaurant.com</p>
          <p>🕐 Hours: 9:00 AM - 10:00 PM</p>
        </div>
      </div>
    </div>
  );
};

export default ComplaintForm;
