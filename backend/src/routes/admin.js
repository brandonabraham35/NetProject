const express = require('express');
const router = express.Router();
const { getDashboardOverview, getAllUsers, getHealthStatus, clearCache } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/overview', authMiddleware, getDashboardOverview);
router.get('/users', authMiddleware, getAllUsers);
router.get('/health', authMiddleware, getHealthStatus);
router.post('/cache/clear', authMiddleware, clearCache);

module.exports = router;
