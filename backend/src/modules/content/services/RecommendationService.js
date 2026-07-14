const contentService = require('./ContentService');

const { List, SearchHistory, ContinueWatching, Profile, ContentAnalytics } = require('../../../models');
const Normalizer = require('../utils/Normalizer');

class RecommendationService {
  // A modular recommendation engine returning merged customized data based on user behavior
  async getPersonalizedRecommendations(userId) {
    const trending = await contentService.getTrending();
    const popularMovies = await contentService.getPopularMovies();
    const popularSeries = await contentService.getPopularSeries();

    // Data returned by ContentService is already UI-adapted (so properties are media_type, not mediaType).
    let recommendedMovies = trending.results?.filter(i => i.media_type === 'movie').slice(0, 10) || [];
    let recommendedSeries = trending.results?.filter(i => i.media_type === 'tv').slice(0, 10) || [];
    let continueWatching = [];
    let recentlyViewed = [];
    let becauseYouWatched = [];
    let topPicks = [];

    if (userId) {
      // Profile preferences (simulated fetching primary profile)
      const profile = await Profile.findOne({ where: { userId }, order: [['createdAt', 'ASC']] });
      const favGenres = profile?.preferences?.genres || [];

      // Fetch user's favorite lists to seed recommendations
      const favorites = await List.findAll({
        where: { userId, type: 'LikedMovies' },
        limit: 3,
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
      continueWatching = watchProgress.map(cw => ({ id: cw.movieId, progress: cw.progress }));

      // Fetch Recently Viewed from Analytics
      const recentAnalytics = await ContentAnalytics.findAll({
        where: { userId, eventType: 'movie_opened' },
        order: [['timestamp', 'DESC']],
        limit: 10
      });
      recentlyViewed = recentAnalytics.map(a => ({ id: a.contentId }));

      // Simulate 'Top Picks' based on preferences or fallback to popular
      if (favGenres.length > 0) {
        try {
          const discovered = await contentService.discover('movie', { with_genres: favGenres.join(',') });
          topPicks = discovered.results?.slice(0, 10) || [];
        } catch(e) {}
      } else {
        topPicks = popularMovies.results?.slice(0, 10) || [];
      }
    } else {
      topPicks = popularMovies.results?.slice(0, 10) || [];
    }

    // Data from ContentService is already adapted to UI, so we just return it raw without re-adapting.
    return {
      recommendedMovies,
      recommendedSeries,
      trendingForUser: trending.results?.slice(0, 10) || [],
      continueWatching,
      becauseYouWatched,
      recentlyViewed,
      topPicksForYou: topPicks,
      newReleases: popularSeries.results?.slice(0, 10) || []
    };
  }
}

module.exports = new RecommendationService();
