const express = require('express');
const router = express.Router();
const { syncUser } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/sync', authMiddleware, syncUser);

module.exports = router;
