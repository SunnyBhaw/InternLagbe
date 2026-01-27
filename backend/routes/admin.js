const express = require('express');
const router = express.Router();
const { getStats, getAllUsers, deleteUser, getAllInternships, getReports } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

// All routes here are protected and restricted to admin
router.use(protect);
router.use(authorize('admin'));

router.get('/stats', getStats);
router.get('/users', getAllUsers);
router.get('/internships', getAllInternships);
router.get('/reports', getReports);
router.delete('/users/:id', deleteUser);

module.exports = router;
