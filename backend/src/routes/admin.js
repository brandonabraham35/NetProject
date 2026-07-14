const express = require('express');
const router = express.Router();
const { getDashboardOverview, getAllUsers, getHealthStatus, getProviderHealth, clearCache, refreshContentCache } = require('../controllers/adminController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/overview', authMiddleware, getDashboardOverview);
router.get('/users', authMiddleware, getAllUsers);
router.get('/health', authMiddleware, getHealthStatus);
router.get('/providers', authMiddleware, getProviderHealth);
router.post('/cache/clear', authMiddleware, clearCache);
router.post('/cache/refresh', authMiddleware, refreshContentCache);

module.exports = router;
