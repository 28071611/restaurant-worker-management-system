import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees } from '../utils/currencyUtils';
import ImageUpload from './ImageUpload';
import {
  ArrowLeft,
  User,
  DollarSign,
  Clock,
  Phone,
  Save,
  Briefcase,
  Mail,
  Award,
  Shield,
  PlusCircle
} from 'lucide-react';

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

  const roles = ['Chef', 'Waiter', 'Cleaner', 'Manager', 'Cashier', 'Security'];
  const shifts = ['Morning', 'Evening', 'Night', 'Full'];
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

    if (formData.salary < 5000) {
      setError('Salary must be at least ₹5000');
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
      Object.keys(formData).forEach(key => {
        if (formData[key]) {
          formDataToSend.append(key, formData[key]);
        }
      });

      if (selectedImage) {
        formDataToSend.append('employeeImage', selectedImage);
      }

      const response = await fetch('/api/workers/with-image', {
        method: 'POST',
        body: formDataToSend
      });

      const data = await response.json();

      if (data.success) {
        setSuccess('ASSET RECRUITED SUCCESSFULLY');
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
        setTimeout(() => navigate('/workers'), 1500);
      } else {
        setError(data.message || 'Asset creation failed');
      }
    } catch (err) {
      setError('Neural link synchronization failed');
    }
    setLoading(false);
  };

  const InputGlass = ({ label, icon: Icon, type, name, value, onChange, placeholder, ...props }) => (
    <div className="space-y-2 group">
      <label className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-emerald-500 transition-colors">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold placeholder:text-gray-700 focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all uppercase tracking-tight"
        {...props}
      />
    </div>
  );

  const SelectGlass = ({ label, icon: Icon, name, value, onChange, options }) => (
    <div className="space-y-2 group">
      <label className="flex items-center space-x-2 text-[10px] font-black text-gray-500 uppercase tracking-[0.2em] group-focus-within:text-emerald-500 transition-colors">
        <Icon className="h-3 w-3" />
        <span>{label}</span>
      </label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white text-sm font-bold appearance-none focus:outline-none focus:border-emerald-500/50 focus:bg-white/10 transition-all uppercase tracking-tight cursor-pointer"
        >
          {options.map(opt => (
            <option key={opt} value={opt} className="bg-neutral-900">{opt}</option>
          ))}
        </select>
        <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
          <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-black relative text-white pb-20">
      <div
        className="fixed inset-0 z-0 bg-cover bg-center bg-no-repeat opacity-30"
        style={{ backgroundImage: 'url("/background.png")' }}
      />
      <div className="fixed inset-0 z-0 bg-gradient-to-b from-black via-black/80 to-black" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-10 space-y-10">
        {/* Navigation Head */}
        <div className="flex items-center space-x-4 animate-fade-in">
          <button onClick={() => navigate(-1)} className="p-3 glass-card hover:bg-white/10 text-white rounded-2xl transition-all">
            <ArrowLeft className="h-6 w-6" />
          </button>
          <div>
            <h1 className="text-4xl font-black tracking-tighter uppercase">Recruitment Terminal</h1>
            <p className="text-emerald-500 text-xs font-black uppercase tracking-[0.3em] flex items-center space-x-2 mt-1">
              <Shield className="h-3 w-3" />
              <span>Initiating New Personnel Onboarding</span>
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Identity Capture Section */}
          <div className="lg:col-span-1 space-y-8 animate-fade-in" style={{ animationDelay: '100ms' }}>
            <div className="glass-card p-8 text-center border-t border-white/10">
              <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest mb-6">Visual Identification</p>
              <ImageUpload
                onImageSelect={setSelectedImage}
                currentImage={null}
                onRemoveImage={() => setSelectedImage(null)}
                className="w-full"
              />
              <p className="text-[9px] text-gray-600 mt-6 uppercase font-bold tracking-tighter">Clear, front-facing biometric data required</p>
            </div>

            <div className="glass-card p-6 bg-emerald-500/5 border border-emerald-500/20">
              <h3 className="text-xs font-black text-emerald-500 uppercase tracking-widest mb-4 flex items-center space-x-2">
                <PlusCircle className="h-4 w-4" />
                <span>Quick Tip</span>
              </h3>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed uppercase tracking-tighter">Experience index impacts starting reputation score. Ensure payroll matches unit role guidelines.</p>
            </div>
          </div>

          {/* Primary Data Input Form */}
          <div className="lg:col-span-2 animate-fade-in" style={{ animationDelay: '200ms' }}>
            <form onSubmit={handleSubmit} className="glass-card p-8 md:p-10 border-t border-emerald-500/20 space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <InputGlass
                  label="Full Asset Name"
                  icon={User}
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="EX: JOHN SILVER"
                  required
                />

                <InputGlass
                  label="Comm Link (Email)"
                  icon={Mail}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="ASSET@COMMAND.COM"
                />

                <InputGlass
                  label="Neural Link (Phone)"
                  icon={Phone}
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="10 DIGIT ID"
                  maxLength={10}
                  required
                />

                <SelectGlass
                  label="Operational Unit"
                  icon={Briefcase}
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  options={departments}
                />

                <SelectGlass
                  label="Specialty Role"
                  icon={Award}
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  options={roles}
                />

                <SelectGlass
                  label="Operating Shift"
                  icon={Clock}
                  name="shift"
                  value={formData.shift}
                  onChange={handleChange}
                  options={shifts}
                />

                <div className="space-y-2">
                  <InputGlass
                    label="Resource Budget"
                    icon={DollarSign}
                    type="number"
                    name="salary"
                    value={formData.salary}
                    onChange={handleChange}
                    placeholder="MIN 5000"
                    min="5000"
                    required
                  />
                  <div className="px-2 py-1 bg-emerald-500/10 rounded-md text-[8px] font-black text-emerald-500 inline-block uppercase tracking-widest">
                    {formData.salary ? `ANNUAL: ${formatIndianRupees(parseInt(formData.salary) * 12)}` : 'AWAITING_INPUT'}
                  </div>
                </div>

                <InputGlass
                  label="Experience index"
                  icon={PlusCircle}
                  type="number"
                  name="experience"
                  value={formData.experience}
                  onChange={handleChange}
                  placeholder="YEARS"
                  min="0"
                />
              </div>

              {error && (
                <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-xl flex items-center space-x-3 text-rose-500 animate-pulse">
                  <AlertCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{error}</p>
                </div>
              )}

              {success && (
                <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-xl flex items-center space-x-3 text-emerald-500">
                  <PlusCircle className="h-5 w-5 flex-shrink-0" />
                  <p className="text-[10px] font-black uppercase tracking-widest">{success}</p>
                </div>
              )}

              <div className="flex items-center justify-end space-x-4 pt-8 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => navigate('/workers')}
                  className="px-8 py-3 bg-white/5 hover:bg-white/10 text-white font-black uppercase text-[10px] tracking-widest rounded-xl border border-white/10 transition-all"
                >
                  Terminate
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-3 bg-emerald-500 hover:bg-emerald-400 text-black font-black uppercase text-[10px] tracking-widest rounded-xl transition-all shadow-xl shadow-emerald-500/20 flex items-center space-x-3 disabled:opacity-50"
                >
                  {loading ? (
                    <div className="h-4 w-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  ) : (
                    <Save className="h-4 w-4" />
                  )}
                  <span>{loading ? 'PROCESSING...' : 'AUTHORIZE RECRUIT'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddWorker;
