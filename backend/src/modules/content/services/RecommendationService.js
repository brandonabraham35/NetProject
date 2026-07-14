const contentService = require('./ContentService');

const { List, SearchHistory, ContinueWatching } = require('../../../models');
const Normalizer = require('../utils/Normalizer');

class RecommendationService {
  // A modular recommendation engine returning merged customized data based on user behavior
  async getPersonalizedRecommendations(userId) {
    const trending = await contentService.getTrending();

    let recommendedMovies = trending.results?.filter(i => i.media_type === 'movie').slice(0, 10) || [];
    let recommendedSeries = trending.results?.filter(i => i.media_type === 'tv').slice(0, 10) || [];
    let continueWatching = [];
    let recentlyViewed = [];
    let becauseYouWatched = [];

    if (userId) {
      // Fetch user's favorite lists to seed recommendations
      const favorites = await List.findAll({
        where: { userId, type: 'LikedMovies' },
        limit: 1,
        order: [['createdAt', 'DESC']]
      });

      if (favorites.length > 0) {
        const lastFav = favorites[0];
        try {
          // Provide 'Because you watched' based on their last favorite
          const similar = await contentService.getRecommendations(lastFav.movieId);
          if (similar && similar.results) {
            becauseYouWatched = similar.results.slice(0, 10);

            // Mix some of these into the general recommended movies
            recommendedMovies = [...similar.results.slice(0, 5), ...recommendedMovies].slice(0, 10);
          }
        } catch(e) {}
      }

      // Fetch user's 'Continue Watching' items
      const watchProgress = await ContinueWatching.findAll({
        where: { userId },
        order: [['updatedAt', 'DESC']],
        limit: 10
      });
      // In a real app we'd fetch the full movie details for each, mocking structure here
      continueWatching = watchProgress.map(cw => ({ id: cw.movieId, progress: cw.progress }));
    }

    // Ensure all internal lists are passed through adaptToUI to prevent frontend crashes
    return {
      recommendedMovies: Normalizer.adaptListToUI(recommendedMovies),
      recommendedSeries: Normalizer.adaptListToUI(recommendedSeries),
      trendingForUser: Normalizer.adaptListToUI(trending.results?.slice(0, 5) || []),
      continueWatching, // structure is different, handle appropriately if used
      becauseYouWatched: Normalizer.adaptListToUI(becauseYouWatched),
      recentlyViewed: Normalizer.adaptListToUI(recentlyViewed)
    };
  }
}

module.exports = new RecommendationService();
