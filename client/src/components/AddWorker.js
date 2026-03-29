import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees } from '../utils/currencyUtils';
import ImageUpload from './ImageUpload';
import { ArrowLeft, User, DollarSign, Clock, Phone, Save, Briefcase } from 'lucide-react';

const AddWorker = () => {
  const navigate = useNavigate();
  const { addWorker } = React.useContext(WorkerContext);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Chef',
    salary: '',
    shift: 'Morning',
    phone: '',
    email: '',
    department: 'Kitchen',
    experience: ''
  });
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const roles = ['Chef', 'Waiter', 'Cleaner', 'Manager', 'Cashier'];
  const shifts = ['Morning', 'Evening', 'Night'];
  const statuses = ['Active', 'On Leave', 'Inactive'];
  const departments = ['Kitchen', 'Service', 'Maintenance', 'Management', 'Billing', 'Security'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const validateForm = () => {
    // Regex validation (Unit III - Regex)
    const nameRegex = /^[A-Za-z ]{3,}$/;
    const phoneRegex = /^[0-9]{10}$/;

    if (!nameRegex.test(formData.name)) {
      setError('Name must contain only letters and spaces, minimum 3 characters');
      return false;
    }

    if (!phoneRegex.test(formData.phone)) {
      setError('Phone number must be exactly 10 digits');
      return false;
    }

    if (formData.salary < 1000) {
      setError('Salary must be at least ₹1000');
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
      const formDataToSend = new FormData();

      // Add form fields
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      // Add image if selected
      if (selectedImage) {
        formDataToSend.append('employeeImage', selectedImage);
      }

      const response = await fetch('/api/workers/with-image', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('Worker added successfully!');
        setFormData({
          name: '',
          role: 'Chef',
          salary: '',
          shift: 'Morning',
          phone: '',
          email: '',
          department: 'Kitchen',
          experience: ''
        });
        setSelectedImage(null);

        setTimeout(() => {
          navigate('/workers');
        }, 2000);
      } else {
        setError(data.message || 'Failed to add worker');
      }
    } catch (err) {
      setError('Failed to connect to server');
    }

    setLoading(false);
  };

  const FormField = ({ label, icon: Icon, children, error }) => (
    <div className="space-y-2">
      <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
        <Icon className="h-4 w-4" />
        <span>{label}</span>
      </label>
      {children}
      {error && <p className="text-red-600 text-sm">{error}</p>}
    </div>
  );

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
          <h1 className="text-3xl font-bold text-gray-900">Add New Worker</h1>
          <p className="text-gray-600 mt-1">Register a new restaurant staff member</p>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload Section */}
          <div className="space-y-2">
            <label className="flex items-center space-x-2 text-sm font-medium text-gray-700">
              <User className="h-4 w-4" />
              <span>Employee Photo</span>
            </label>
            <ImageUpload
              onImageSelect={setSelectedImage}
              currentImage={null}
              onRemoveImage={() => setSelectedImage(null)}
              className="w-full"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField label="Full Name" icon={User}>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter worker's full name"
                className="input-field"
                required
              />
            </FormField>

            <FormField label="Email" icon={User}>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="worker@example.com"
                className="input-field"
              />
            </FormField>

            <FormField label="Phone Number" icon={Phone}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="input-field"
                maxLength={10}
                required
              />
            </FormField>

            <FormField label="Role" icon={User}>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Role</option>
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Salary (₹/month)" icon={DollarSign}>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="25000"
                className="input-field"
                min="5000"
                max="100000"
                required
              />
              <div className="text-sm text-gray-500">
                {formData.salary ? `≈ ${formatIndianRupees(parseInt(formData.salary) * 12)}/year` : 'Enter salary amount'}
              </div>
            </FormField>

            <FormField label="Shift" icon={Clock}>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Shift</option>
                {shifts.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Department" icon={User}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                required
              >
                <option value="">Select Department</option>
                {departments.map(department => (
                  <option key={department} value={department}>{department}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Experience (years)" icon={User}>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="5"
                className="input-field"
                min="0"
                max="50"
              />
            </FormField>
          </div>

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
              <Save className="h-4 w-4" />
              <span>{loading ? 'Adding...' : 'Add Worker'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Info Card */}
      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="font-medium text-blue-900 mb-2">💡 Quick Tips</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Name should contain only letters and spaces (min. 3 characters)</li>
          <li>• Phone number must be exactly 10 digits</li>
          <li>• Email is optional but recommended for communication</li>
          <li>• Upload a clear, professional photo of the employee</li>
          <li>• Experience helps in reputation calculations</li>
        </ul>
      </div>
    </div>
  );
};

export default AddWorker;
