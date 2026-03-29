import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { WorkerContext } from '../context/WorkerContext';
import { formatIndianRupees } from '../utils/currencyUtils';
import { 
  Search, 
  Filter, 
  ArrowUpDown, 
  Edit, 
  Trash2, 
  Plus, 
  User,
  DollarSign,
  Clock,
  Phone,
  Star,
  Eye
} from 'lucide-react';

const WorkerList = () => {
  const { 
    workers, 
    loading, 
    deleteWorker, 
    searchWorkers, 
    filterWorkers, 
    sortWorkers,
    getUniqueRoles 
  } = React.useContext(WorkerContext);
  
  const [filteredWorkers, setFilteredWorkers] = useState(workers);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [deleteConfirm, setDeleteConfirm] = useState(null);

  useEffect(() => {
    setFilteredWorkers(workers);
  }, [workers]);

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim() === '') {
      setFilteredWorkers(workers);
      return;
    }

    // Lambda/Arrow Function - Filter workers
    const filtered = workers.filter(worker => 
      worker.name.toLowerCase().includes(query.toLowerCase()) ||
      worker.role.toLowerCase().includes(query.toLowerCase()) ||
      worker.phone.includes(query)
    );
    setFilteredWorkers(filtered);
  };

  const handleFilter = (role) => {
    setSelectedRole(role);
    if (role === 'All') {
      setFilteredWorkers(workers);
    } else {
      // Stream API - Filter by role
      const filtered = workers.filter(worker => worker.role === role);
      setFilteredWorkers(filtered);
    }
  };

  const handleSort = (field) => {
    setSortBy(field);
    const newOrder = sortOrder === 'asc' ? 'desc' : 'asc';
    setSortOrder(newOrder);

    // Comparator Pattern - Sort workers
    const sorted = [...filteredWorkers].sort((a, b) => {
      let aVal = a[field];
      let bVal = b[field];

      if (typeof aVal === 'string') {
        aVal = aVal.toLowerCase();
        bVal = bVal.toLowerCase();
      }

      if (newOrder === 'asc') {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

    setFilteredWorkers(sorted);
  };

  const handleDelete = async (id) => {
    const result = await deleteWorker(id);
    if (result.success) {
      setDeleteConfirm(null);
    }
  };

  const WorkerCard = ({ worker }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-4">
          {/* Employee Image or Avatar */}
          <div className="relative">
            {worker.employeeImage && worker.employeeImage.filename ? (
              <img
                src={`/uploads/${worker.employeeImage.filename}`}
                alt={worker.name}
                className="h-12 w-12 rounded-full object-cover"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'flex';
                }}
              />
            ) : null}
            <div className={`h-12 w-12 bg-primary-100 rounded-full flex items-center justify-center ${
              worker.employeeImage && worker.employeeImage.filename ? 'hidden' : ''
            }`}>
              <span className="text-lg font-medium text-primary-700">
                {worker.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">{worker.name}</h3>
            <p className="text-gray-600">{worker.role}</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Link
            to={`/worker/${worker._id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="View Profile"
          >
            <Eye className="h-4 w-4" />
          </Link>
          <Link
            to={`/edit-worker/${worker._id}`}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            title="Edit Worker"
          >
            <Edit className="h-4 w-4" />
          </Link>
          <Link
            to={`/rate-worker/${worker._id}`}
            className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
            title="Rate Worker"
          >
            <Star className="h-4 w-4" />
          </Link>
          <button
            onClick={() => setDeleteConfirm(worker._id)}
            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            title="Delete Worker"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <DollarSign className="h-4 w-4" />
          <span>{formatIndianRupees(worker.salary)}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{worker.shift}</span>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Phone className="h-4 w-4" />
          <span>{worker.phone}</span>
        </div>
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            worker.status === 'Active' 
              ? 'bg-green-100 text-green-800' 
              : 'bg-yellow-100 text-yellow-800'
          }`}>
            {worker.status}
          </span>
        </div>
      </div>

      {deleteConfirm === worker._id && (
        <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800 mb-3">
            Are you sure you want to delete {worker.name}?
          </p>
          <div className="flex justify-end space-x-2">
            <button
              onClick={() => setDeleteConfirm(null)}
              className="px-3 py-1 text-sm bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={() => handleDelete(worker._id)}
              className="px-3 py-1 text-sm bg-red-600 text-white rounded hover:bg-red-700"
            >
              Delete
            </button>
          </div>
        </div>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Workers</h1>
          <p className="text-gray-600 mt-1">Manage your restaurant staff</p>
        </div>
        <Link to="/add-worker" className="btn-primary flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Add Worker</span>
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search workers..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 input-field"
            />
          </div>

          {/* Role Filter */}
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={selectedRole}
              onChange={(e) => handleFilter(e.target.value)}
              className="pl-10 input-field appearance-none"
            >
              <option value="All">All Roles</option>
              {getUniqueRoles().map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="relative">
            <ArrowUpDown className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                handleSort(field);
              }}
              className="pl-10 input-field appearance-none"
            >
              <option value="name-asc">Name (A-Z)</option>
              <option value="name-desc">Name (Z-A)</option>
              <option value="salary-asc">Salary (Low to High)</option>
              <option value="salary-desc">Salary (High to Low)</option>
              <option value="role-asc">Role (A-Z)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          Showing <span className="font-medium">{filteredWorkers.length}</span> of{' '}
          <span className="font-medium">{workers.length}</span> workers
        </p>
        
        {/* Collection Concepts Display */}
        <div className="flex items-center space-x-4 text-sm text-gray-500">
          <span>List: {workers.length}</span>
          <span>Set: {getUniqueRoles().length} roles</span>
          <span>Map: {Object.keys(workers.reduce((map, w) => {
            map[w.role] = (map[w.role] || 0) + 1;
            return map;
          }, {})).length} groups</span>
        </div>
      </div>

      {/* Workers Grid */}
      {filteredWorkers.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWorkers.map(worker => (
            <WorkerCard key={worker._id} worker={worker} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <User className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No workers found</h3>
          <p className="text-gray-600 mb-4">
            {searchQuery || selectedRole !== 'All' 
              ? 'Try adjusting your search or filters' 
              : 'Get started by adding your first worker'
            }
          </p>
          {!searchQuery && selectedRole === 'All' && (
            <Link to="/add-worker" className="btn-primary">
              Add Worker
            </Link>
          )}
        </div>
      )}
    </div>
  );
};

export default WorkerList;
