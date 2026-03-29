const express = require('express');
const router = express.Router();
const {
  addWorker,
  getWorkers,
  searchWorkers,
  filterWorkers,
  sortWorkers,
  updateWorker,
  deleteWorker
} = require('../controllers/workerController');

// MVC Pattern - Routes (Controller)
router.post('/', addWorker);
router.get('/', getWorkers);
router.get('/search', searchWorkers);
router.get('/role/:role', filterWorkers);
router.get('/sort', sortWorkers);
router.put('/:id', updateWorker);
router.delete('/:id', deleteWorker);

module.exports = router;
