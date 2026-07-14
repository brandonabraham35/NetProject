const express = require('express');
const router = express.Router();
const streamingController = require('../controllers/streamingController');
const authMiddleware = require('../../../middleware/authMiddleware');
const uploadManager = require('../uploads/UploadManager');

// Public route for actual streaming (protected internally by ?token validation)
router.get('/stream/:id', streamingController.stream);

// Protected routes to acquire streaming tokens
router.get('/media/:id/token', authMiddleware, streamingController.getPlaybackToken);

// Admin / Upload routes
router.post('/media/upload', authMiddleware, uploadManager.single('video'), streamingController.uploadMedia);

module.exports = router;
