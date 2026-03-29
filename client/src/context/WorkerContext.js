import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';

// Context for managing worker data globally
export const WorkerContext = createContext();

export const WorkerProvider = ({ children }) => {
  const [workers, setWorkers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch all workers
  const fetchWorkers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/workers');
      setWorkers(response.data.data);
      setError(null);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to fetch workers');
    } finally {
      setLoading(false);
    }
  };

  // Add new worker
  const addWorker = async (workerData) => {
    try {
      const response = await axios.post('/api/workers', workerData);
      setWorkers([...workers, response.data.data]);
      return { success: true, message: 'Worker added successfully' };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to add worker';
      setError(message);
      return { success: false, message };
    }
  };

  // Update worker
  const updateWorker = async (id, workerData) => {
    try {
      const response = await axios.put(`/api/workers/${id}`, workerData);
      setWorkers(workers.map(worker => 
        worker._id === id ? response.data.data : worker
      ));
      return { success: true, message: 'Worker updated successfully' };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to update worker';
      setError(message);
      return { success: false, message };
    }
  };

  // Delete worker
  const deleteWorker = async (id) => {
    try {
      await axios.delete(`/api/workers/${id}`);
      setWorkers(workers.filter(worker => worker._id !== id));
      return { success: true, message: 'Worker deleted successfully' };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to delete worker';
      setError(message);
      return { success: false, message };
    }
  };

  // Search workers
  const searchWorkers = async (query) => {
    try {
      const response = await axios.get(`/api/workers/search?query=${query}`);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to search workers';
      setError(message);
      return { success: false, message };
    }
  };

  // Filter workers by role
  const filterWorkers = async (role) => {
    try {
      const response = await axios.get(`/api/workers/role/${role}`);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to filter workers';
      setError(message);
      return { success: false, message };
    }
  };

  // Sort workers
  const sortWorkers = async (sortBy, order = 'desc') => {
    try {
      const response = await axios.get(`/api/workers/sort?sortBy=${sortBy}&order=${order}`);
      return { success: true, data: response.data.data };
    } catch (err) {
      const message = err.response?.data?.message || 'Failed to sort workers';
      setError(message);
      return { success: false, message };
    }
  };

  // Collection concepts demonstration
  const getUniqueRoles = () => {
    // Set concept - Get unique roles
    return [...new Set(workers.map(worker => worker.role))];
  };

  const getWorkersByRole = () => {
    // Map concept - Group workers by role
    return workers.reduce((map, worker) => {
      if (!map[worker.role]) {
        map[worker.role] = [];
      }
      map[worker.role].push(worker);
      return map;
    }, {});
  };

  const getAverageSalary = () => {
    // Lambda/Arrow function - Calculate average
    if (workers.length === 0) return 0;
    const total = workers.reduce((sum, worker) => sum + worker.salary, 0);
    return Math.round(total / workers.length);
  };

  useEffect(() => {
    fetchWorkers();
  }, []);

  const value = {
    workers,
    loading,
    error,
    fetchWorkers,
    addWorker,
    updateWorker,
    deleteWorker,
    searchWorkers,
    filterWorkers,
    sortWorkers,
    getUniqueRoles,
    getWorkersByRole,
    getAverageSalary
  };

  return (
    <WorkerContext.Provider value={value}>
      {children}
    </WorkerContext.Provider>
  );
};
