const express = require('express');
const router = express.Router();
const contentController = require('../controllers/contentController');
const authMiddleware = require('../../../middleware/authMiddleware');

// Optional auth wrapper that doesn't fail if token is missing
const optionalAuth = (req, res, next) => {
  if (req.headers.authorization) {
    return authMiddleware(req, res, next);
  }
  next();
};

router.get('/home', contentController.getTrending); // simplified home endpoint pointing to trending
router.get('/trending/movies', contentController.getTrendingMovies);
router.get('/trending/series', contentController.getTrendingSeries);
router.get('/trending/all', contentController.getTrending);

router.get('/popular/movies', contentController.getPopularMovies);
router.get('/popular/series', contentController.getPopularSeries);

router.get('/search', optionalAuth, contentController.search);
router.get('/search/suggestions', contentController.getSearchSuggestions);
router.get('/movie/:id', optionalAuth, contentController.getMovie);
router.get('/series/:id', optionalAuth, contentController.getSeries);
router.get('/season/:id', (req, res) => {
    // Handling generic getSeason logic - TMDB expects seriesID and seasonNumber.
    // E.g., /season/:seriesId/:seasonNumber is better. We map via proxy or specific params.
    res.status(400).json({ error: 'Use /series/:id/season/:seasonId instead' });
});
router.get('/series/:id/season/:seasonId', optionalAuth, contentController.getSeason);
router.get('/series/:id/season/:seasonId/episode/:episodeId', optionalAuth, contentController.getEpisode);
router.get('/recommendations', authMiddleware, contentController.getRecommendations);
router.get('/movie/:id/recommendations', optionalAuth, contentController.getMovieRecommendations);
router.get('/genres', contentController.getGenres);
router.get('/upcoming', contentController.getUpcoming);

router.get('/:type/:id/videos', optionalAuth, contentController.getVideos); // generic handler for /movie/:id/videos and /series/:id/videos
router.get('/discover/:type', optionalAuth, contentController.discover);

module.exports = router;
