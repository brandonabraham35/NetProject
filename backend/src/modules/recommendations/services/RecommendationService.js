const engine = require('../engines/RecommendationEngine');
const Normalizer = require('../../content/utils/Normalizer');

class RecommendationService {

  /**
   * Returns merged, fully personalized recommendations matching the UI expectations
   */
  async getPersonalizedRecommendations(userId) {
    // Generate aggregated, deduplicated content from the Engine
    const finalRecommendations = await engine.generatePersonalizedRecommendations(userId);

    // Map these dynamically into the structural expectations of the frontend
    // The frontend historically expects:
    // recommendedMovies, recommendedSeries, continueWatching, trendingForUser, becauseYouWatched, topPicksForYou, newReleases

    // Initialize groupings
    const grouped = {
      recommendedMovies: [],
      recommendedSeries: [],
      continueWatching: [],
      trendingForUser: [],
      becauseYouWatched: [],
      topPicksForYou: [],
      newReleases: [], // For future strategies or generic trending mapping
      recentlyViewed: []
    };

    // Distribute content into rows based on the dominating strategy
    for (const rec of finalRecommendations) {
      // Ensure all objects are passed to UI adapter so they safely map properties like backdrop_path
      const uiItem = Normalizer.adaptToUI(rec.content);

      if (rec.strategies.includes('ContinueWatchingStrategy')) {
        grouped.continueWatching.push({ id: uiItem.id, progress: rec.metadata?.progress || 0 });
      } else if (rec.strategies.includes('FavoriteStrategy')) {
        grouped.becauseYouWatched.push(uiItem);
        if (uiItem.media_type === 'movie') grouped.recommendedMovies.push(uiItem);
        if (uiItem.media_type === 'tv') grouped.recommendedSeries.push(uiItem);
      } else if (rec.strategies.includes('SearchHistoryStrategy') || rec.strategies.includes('GenreStrategy')) {
        grouped.topPicksForYou.push(uiItem);
        if (uiItem.media_type === 'movie') grouped.recommendedMovies.push(uiItem);
        if (uiItem.media_type === 'tv') grouped.recommendedSeries.push(uiItem);
      } else if (rec.strategies.includes('TrendingStrategy')) {
        grouped.trendingForUser.push(uiItem);
        if (uiItem.media_type === 'movie') grouped.recommendedMovies.push(uiItem);
        if (uiItem.media_type === 'tv') grouped.recommendedSeries.push(uiItem);
      }
    }

    // Deduplicate lists just in case
    const dedupe = (arr) => [...new Map(arr.map(item => [item.id, item])).values()].slice(0, 15);

    return {
      recommendedMovies: dedupe(grouped.recommendedMovies),
      recommendedSeries: dedupe(grouped.recommendedSeries),
      trendingForUser: dedupe(grouped.trendingForUser),
      continueWatching: grouped.continueWatching.slice(0, 10), // Keep custom CW structure
      becauseYouWatched: dedupe(grouped.becauseYouWatched),
      topPicksForYou: dedupe(grouped.topPicksForYou),
      newReleases: dedupe(grouped.newReleases),
      recentlyViewed: dedupe(grouped.recentlyViewed)
    };
  }
}

module.exports = new RecommendationService();
