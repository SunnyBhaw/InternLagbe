const express = require('express');
const router = express.Router();
const {
    applyForInternship,
    getStudentApplications,
    getCompanyApplications,
    updateApplicationStatus,
    uploadFile
} = require('../controllers/applicationController');

const { protect, authorize, verifyProfile } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/upload', upload.single('resume'), uploadFile);

// Student routes
router.post('/apply/:internshipId', authorize('student'), verifyProfile, upload.single('resume'), applyForInternship);
router.get('/my', authorize('student'), getStudentApplications);

// Company routes
router.get('/company', authorize('company'), getCompanyApplications);
router.put('/:id/status', authorize('company'), updateApplicationStatus);

module.exports = router;
