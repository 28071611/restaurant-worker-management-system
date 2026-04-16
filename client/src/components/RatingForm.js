import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import StarRating from './StarRating';
import { Star, MessageSquare, User, ArrowLeft } from 'lucide-react';

const RatingForm = () => {
  const navigate = useNavigate();
  const { workers } = React.useContext(WorkerContext);
  const [formData, setFormData] = useState({
    workerId: '',
    rating: 0,
    feedback: '',
    clientName: '',
    serviceType: 'Dining'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const workerId = window.location.pathname.split('/').pop();
    if (workerId && workerId !== 'rate-worker') {
      setFormData(prev => ({
        ...prev,
        workerId
      }));
    }
  }, []);

  const serviceTypes = ['Dining', 'Takeaway', 'Delivery', 'Catering'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleRatingChange = (rating) => {
    setFormData(prev => ({
      ...prev,
      rating
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.rating === 0) {
      setError('Please select a rating');
      return;
    }

    if (!formData.clientName.trim()) {
      setError('Please enter your name');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/reputation/ratings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Thank you for your rating!');
        setFormData({
          workerId: '',
          rating: 0,
          feedback: '',
          clientName: '',
          serviceType: 'Dining'
        });
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError('Failed to submit rating. Please try again.');
    }

    setLoading(false);
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
          <h1 className="text-3xl font-bold text-gray-900">Rate Worker</h1>
          <p className="text-gray-600 mt-1">Share your experience with our staff</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800">{success}</p>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <User className="h-4 w-4" />
                <span>Select Worker</span>
              </label>
              <select
                name="workerId"
                value={formData.workerId}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Choose a worker...</option>
                {workers.map(worker => (
                  <option key={worker._id} value={worker._id}>
                    {worker.name} - {worker.role}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <Star className="h-4 w-4" />
                <span>Your Rating</span>
              </label>
              <div className="p-4 bg-gray-50 rounded-lg">
                <StarRating
                  rating={formData.rating}
                  onRatingChange={handleRatingChange}
                  size="lg"
                />
              </div>
            </div>

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
                placeholder="Enter your name"
                className="input-field"
                required
              />
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Service Type
              </label>
              <div className="grid grid-cols-2 gap-2">
                {serviceTypes.map(type => (
                  <label key={type} className="flex items-center space-x-2 cursor-pointer">
                    <input
                      type="radio"
                      name="serviceType"
                      value={type}
                      checked={formData.serviceType === type}
                      onChange={handleChange}
                      className="text-primary-600"
                    />
                    <span className="text-sm text-gray-700">{type}</span>
                  </label>
                ))}
              </div>
            </div>

            <div>
              <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                <MessageSquare className="h-4 w-4" />
                <span>Feedback (Optional)</span>
              </label>
              <textarea
                name="feedback"
                value={formData.feedback}
                onChange={handleChange}
                placeholder="Share your experience..."
                rows={4}
                className="input-field resize-none"
                maxLength={500}
              />
              <p className="text-xs text-gray-500 mt-1">
                {formData.feedback.length}/500 characters
              </p>
            </div>
          </div>

          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={() => navigate('/workers')}
              className="btn-secondary"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary flex items-center space-x-2 disabled:opacity-50"
            >
              <Star className="h-4 w-4" />
              <span>{loading ? 'Submitting...' : 'Submit Rating'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RatingForm;
