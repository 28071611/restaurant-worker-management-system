const express = require('express');
const router = express.Router();
const {
  getWorkers,
  addWorker,
  updateWorker,
  deleteWorker,
  getWorkerById,
  searchWorkers,
  filterWorkers,
  sortWorkers,
  getWorkerStats,
  addWorkerWithImage,
  updateWorkerImage,
  removeWorkerImage
} = require('../controllers/workerController');
const { uploadEmployeeImage } = require('../middleware/upload');

// Public routes
router.get('/', getWorkers);
router.get('/search', searchWorkers);
router.get('/filter', filterWorkers);
router.get('/sort', sortWorkers);
router.get('/stats', getWorkerStats);
router.get('/:id', getWorkerById);

// Routes with image upload
router.post('/with-image', uploadEmployeeImage, addWorkerWithImage);
router.put('/:id/image', uploadEmployeeImage, updateWorkerImage);
router.delete('/:id/image', removeWorkerImage);

// Traditional routes (for backward compatibility)
router.post('/', addWorker);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

module.exports = router;
