const express = require('express');
const router = express.Router();
const { getProfile, updateProfile } = require('../controllers/profileController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/me', getProfile);
router.post('/', updateProfile);

module.exports = router;
