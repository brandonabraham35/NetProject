const BaseStrategy = require('./BaseStrategy');
const { List } = require('../../../models');
const contentService = require('../../content/services/ContentService');

class FavoriteStrategy extends BaseStrategy {
  constructor() {
    super('FavoriteStrategy');
  }

  async execute(userId, context) {
    if (!userId) return [];

    const favorites = await List.findAll({
      where: { userId, type: 'LikedMovies' },
      order: [['createdAt', 'DESC']],
      limit: 3
    });

    if (favorites.length === 0) return [];

    let recommendations = [];

    // Fetch similar content based on up to 3 recent favorites
    for (const fav of favorites) {
      try {
        const similar = await contentService.getRecommendations(fav.movieId);
        if (similar && similar.results) {
          const recs = similar.results.slice(0, 10).map((item, idx) => {
             // Higher score for items similar to very recent favorites
             const score = 90 - (idx * 2);
             return this.buildRecommendation(
               item,
               score,
               0.8, // high confidence because it's explicitly liked
               `Because you liked similar titles`
             );
          });
          recommendations = recommendations.concat(recs);
        }
      } catch (e) {
        // Soft fail
      }
    }

    return recommendations;
  }
}

module.exports = FavoriteStrategy;
