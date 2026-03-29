import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  workers: [],
  loading: false,
  error: null,
  filteredWorkers: [],
  searchQuery: '',
  filterRole: '',
  filterDepartment: '',
  sortBy: 'name'
};

// Action types
const actionTypes = {
  SET_LOADING: 'SET_LOADING',
  SET_WORKERS: 'SET_WORKERS',
  SET_ERROR: 'SET_ERROR',
  SET_SEARCH_QUERY: 'SET_SEARCH_QUERY',
  SET_FILTER_ROLE: 'SET_FILTER_ROLE',
  SET_FILTER_DEPARTMENT: 'SET_FILTER_DEPARTMENT',
  SET_SORT_BY: 'SET_SORT_BY',
  SET_FILTERED_WORKERS: 'SET_FILTERED_WORKERS'
};

// Reducer function
const workerReducer = (state, action) => {
  switch (action.type) {
    case actionTypes.SET_LOADING:
      return { ...state, loading: action.payload };
    case actionTypes.SET_WORKERS:
      return { ...state, workers: action.payload, loading: false };
    case actionTypes.SET_ERROR:
      return { ...state, error: action.payload, loading: false };
    case actionTypes.SET_SEARCH_QUERY:
      return { ...state, searchQuery: action.payload };
    case actionTypes.SET_FILTER_ROLE:
      return { ...state, filterRole: action.payload };
    case actionTypes.SET_FILTER_DEPARTMENT:
      return { ...state, filterDepartment: action.payload };
    case actionTypes.SET_SORT_BY:
      return { ...state, sortBy: action.payload };
    case actionTypes.SET_FILTERED_WORKERS:
      return { ...state, filteredWorkers: action.payload };
    default:
      return state;
  }
};

// Create context
const WorkerContext = createContext();

// Provider component
export const WorkerProvider = ({ children }) => {
  const [state, dispatch] = useReducer(workerReducer, initialState);

  // Fetch workers from API
  const fetchWorkers = async () => {
    dispatch({ type: actionTypes.SET_LOADING, payload: true });
    try {
      const response = await fetch('http://localhost:5001/api/workers');
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: actionTypes.SET_WORKERS, payload: data.data });
        dispatch({ type: actionTypes.SET_FILTERED_WORKERS, payload: data.data });
      } else {
        dispatch({ type: actionTypes.SET_ERROR, payload: data.message });
      }
    } catch (error) {
      dispatch({ type: actionTypes.SET_ERROR, payload: error.message });
    }
  };

  // Add worker
  const addWorker = async (workerData) => {
    try {
      const response = await fetch('http://localhost:5001/api/workers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerData),
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchWorkers(); // Refresh the workers list
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Update worker
  const updateWorker = async (id, workerData) => {
    try {
      const response = await fetch(`http://localhost:5001/api/workers/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(workerData),
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchWorkers(); // Refresh the workers list
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Delete worker
  const deleteWorker = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/workers/${id}`, {
        method: 'DELETE',
      });
      const data = await response.json();
      
      if (data.success) {
        await fetchWorkers(); // Refresh the workers list
        return { success: true };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Get worker by ID
  const getWorkerById = async (id) => {
    try {
      const response = await fetch(`http://localhost:5001/api/workers/${id}`);
      const data = await response.json();
      
      if (data.success) {
        return { success: true, data: data.data };
      } else {
        return { success: false, message: data.message };
      }
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  // Search workers
  const searchWorkers = async (query) => {
    try {
      const response = await fetch(`http://localhost:5001/api/workers/search?query=${query}`);
      const data = await response.json();
      
      if (data.success) {
        dispatch({ type: actionTypes.SET_FILTERED_WORKERS, payload: data.data });
      }
    } catch (error) {
      console.error('Search error:', error);
    }
  };

  // Filter and sort workers
  const applyFiltersAndSort = () => {
    let filtered = [...state.workers];

    // Apply search filter
    if (state.searchQuery) {
      filtered = filtered.filter(worker =>
        worker.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        worker.role.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
        worker.phone.includes(state.searchQuery)
      );
    }

    // Apply role filter
    if (state.filterRole) {
      filtered = filtered.filter(worker => worker.role === state.filterRole);
    }

    // Apply department filter
    if (state.filterDepartment) {
      filtered = filtered.filter(worker => worker.department === state.filterDepartment);
    }

    // Apply sorting
    filtered.sort((a, b) => {
      switch (state.sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'salary':
          return b.salary - a.salary;
        case 'role':
          return a.role.localeCompare(b.role);
        case 'department':
          return a.department.localeCompare(b.department);
        default:
          return a.name.localeCompare(b.name);
      }
    });

    dispatch({ type: actionTypes.SET_FILTERED_WORKERS, payload: filtered });
  };

  // Action creators
  const setSearchQuery = (query) => {
    dispatch({ type: actionTypes.SET_SEARCH_QUERY, payload: query });
  };

  const setFilterRole = (role) => {
    dispatch({ type: actionTypes.SET_FILTER_ROLE, payload: role });
  };

  const setFilterDepartment = (department) => {
    dispatch({ type: actionTypes.SET_FILTER_DEPARTMENT, payload: department });
  };

  const setSortBy = (sortBy) => {
    dispatch({ type: actionTypes.SET_SORT_BY, payload: sortBy });
  };

  // Get unique roles
  const getUniqueRoles = () => {
    return [...new Set(state.workers.map(worker => worker.role))];
  };

  // Get unique departments
  const getUniqueDepartments = () => {
    return [...new Set(state.workers.map(worker => worker.department))];
  };

  // Get average salary
  const getAverageSalary = () => {
    if (state.workers.length === 0) return 0;
    const total = state.workers.reduce((sum, worker) => sum + worker.salary, 0);
    return total / state.workers.length;
  };

  // Get workers by role
  const getWorkersByRole = () => {
    const workersByRole = {};
    state.workers.forEach(worker => {
      if (!workersByRole[worker.role]) {
        workersByRole[worker.role] = [];
      }
      workersByRole[worker.role].push(worker);
    });
    return workersByRole;
  };

  // Apply filters and sort whenever dependencies change
  useEffect(() => {
    applyFiltersAndSort();
  }, [state.workers, state.searchQuery, state.filterRole, state.filterDepartment, state.sortBy]);

  // Fetch workers on component mount
  useEffect(() => {
    fetchWorkers();
  }, []);

  const value = {
    // State
    ...state,
    
    // Actions
    fetchWorkers,
    addWorker,
    updateWorker,
    deleteWorker,
    getWorkerById,
    searchWorkers,
    setSearchQuery,
    setFilterRole,
    setFilterDepartment,
    setSortBy,
    
    // Utility functions
    getUniqueRoles,
    getUniqueDepartments,
    getAverageSalary,
    getWorkersByRole
  };

  return (
    <WorkerContext.Provider value={value}>
      {children}
    </WorkerContext.Provider>
  );
};

// Custom hook to use the context
export const useWorkerContext = () => {
  const context = useContext(WorkerContext);
  if (!context) {
    throw new Error('useWorkerContext must be used within a WorkerProvider');
  }
  return context;
};

// Export the context for backward compatibility
export { WorkerContext };
