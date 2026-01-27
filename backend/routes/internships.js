const express = require('express');
const router = express.Router();
const {
    createInternship,
    getMyInternships,
    getInternships,
    updateInternship,
    deleteInternship,
    getCompanyStats,
    getInternship
} = require('../controllers/internshipController');

const { protect, authorize, verifyProfile } = require('../middleware/auth');

// Public routes
router.get('/', getInternships);

// Protected static routes
router.get('/stats', protect, authorize('company'), getCompanyStats);
router.get('/my', protect, authorize('company'), getMyInternships);

// Public Parameter Route
router.get('/:id', getInternship);

// Global protection for remaining routes
router.use(protect);

router.post('/', authorize('company'), verifyProfile, createInternship);
router.put('/:id', authorize('company', 'admin'), updateInternship);
router.delete('/:id', authorize('company', 'admin'), deleteInternship);

module.exports = router;
