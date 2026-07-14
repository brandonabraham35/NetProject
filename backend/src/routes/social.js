const express = require('express');
const router = express.Router();
const socialController = require('../controllers/socialController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/reviews', authMiddleware, socialController.createReview);
router.get('/reviews/:contentId', socialController.getReviews);

module.exports = router;
