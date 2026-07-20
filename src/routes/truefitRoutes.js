const express = require('express');
const router = express.Router();

const authenticateToken = require('../middleware/authMiddleware');
const { saveTrueFit, getTrueFit } = require('../controllers/truefitController');

// Save TrueFit profile
router.post('/save', authenticateToken, saveTrueFit);

// Fetch logged-in user's TrueFit profile
router.get('/me', authenticateToken, getTrueFit);

module.exports = router;