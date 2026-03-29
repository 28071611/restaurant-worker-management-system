import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import { ArrowLeft, Save, User, DollarSign, Clock, Phone, Briefcase } from 'lucide-react';

const EditWorker = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workers, updateWorker } = React.useContext(WorkerContext);
  const [formData, setFormData] = useState({
    name: '',
    role: 'Chef',
    salary: '',
    shift: 'Morning',
    phone: '',
    status: 'Active',
    department: 'Kitchen'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const roles = ['Chef', 'Waiter', 'Cleaner', 'Manager', 'Cashier'];
  const shifts = ['Morning', 'Evening', 'Night'];
  const statuses = ['Active', 'On Leave', 'Inactive'];
  const departments = ['Kitchen', 'Service', 'Maintenance', 'Management', 'Billing', 'Security'];

  useEffect(() => {
    const worker = workers.find(w => w._id === id);
    if (worker) {
      setFormData({
        name: worker.name,
        role: worker.role,
        salary: worker.salary.toString(),
        shift: worker.shift,
        phone: worker.phone,
        status: worker.status,
        department: worker.department || 'Kitchen'
      });
    } else {
      navigate('/workers');
    }
  }, [id, workers, navigate]);

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

    const result = await updateWorker(id, {
      ...formData,
      salary: parseInt(formData.salary)
    });

    if (result.success) {
      navigate('/workers');
    } else {
      setError(result.message);
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
      {/* Header */}
      <div className="flex items-center space-x-4 mb-8">
        <button
          onClick={() => navigate(-1)}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Edit Worker</h1>
          <p className="text-gray-600 mt-1">Update worker information</p>
        </div>
      </div>

      {/* Form */}
      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-800">{error}</p>
            </div>
          )}

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

            <FormField label="Phone Number" icon={Phone}>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="10-digit phone number"
                className="input-field"
                maxLength={10}
                required
              />
            </FormField>

            <FormField label="Role" icon={Briefcase}>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="input-field"
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Salary (₹)" icon={DollarSign}>
              <input
                type="number"
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                placeholder="Monthly salary"
                className="input-field"
                min="1000"
                required
              />
            </FormField>

            <FormField label="Shift" icon={Clock}>
              <select
                name="shift"
                value={formData.shift}
                onChange={handleChange}
                className="input-field"
                required
              >
                {shifts.map(shift => (
                  <option key={shift} value={shift}>{shift}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Status" icon={User}>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="input-field"
                required
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
            </FormField>

            <FormField label="Department" icon={Briefcase}>
              <select
                name="department"
                value={formData.department}
                onChange={handleChange}
                className="input-field"
                required
              >
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </FormField>
          </div>

          {/* Form Actions */}
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
              <span>{loading ? 'Updating...' : 'Update Worker'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditWorker;
