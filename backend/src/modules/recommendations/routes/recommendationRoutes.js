const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/RecommendationController');
const authMiddleware = require('../../../middleware/authMiddleware');

const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

router.get('/', optionalAuth, recommendationController.getRecommendations);
router.get('/home', optionalAuth, recommendationController.getRecommendations);
router.get('/because-you-watched', optionalAuth, recommendationController.getBecauseYouWatched);
router.get('/top-picks', optionalAuth, recommendationController.getTopPicks);
router.get('/continue-watching', optionalAuth, recommendationController.getContinueWatching);
router.get('/trending-for-user', optionalAuth, recommendationController.getTrendingForUser);

router.post('/feedback', authMiddleware, recommendationController.postFeedback);

module.exports = router;
