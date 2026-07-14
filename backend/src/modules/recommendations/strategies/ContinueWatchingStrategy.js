const BaseStrategy = require('./BaseStrategy');
const { ContinueWatching } = require('../../../models');
const contentService = require('../../content/services/ContentService');

class ContinueWatchingStrategy extends BaseStrategy {
  constructor() {
    super('ContinueWatchingStrategy');
  }

  async execute(userId, context) {
    if (!userId) return [];

    const watchProgress = await ContinueWatching.findAll({
      where: { userId },
      order: [['updatedAt', 'DESC']],
      limit: 5
    });

    if (watchProgress.length === 0) return [];

    const recommendations = [];
    for (const cw of watchProgress) {
      try {
        // Eagerly fetching movie/series logic depending on string formats in DB, assuming movie here for simplicity
        const item = await contentService.getMovie(cw.movieId);
        if (item) {
          recommendations.push(this.buildRecommendation(
            item,
            100, // Very high priority
            1.0,
            `Continue watching`,
            { progress: cw.progress }
          ));
        }
      } catch (e) {
        // Skip on fail
      }
    }

    return recommendations;
  }
}

module.exports = ContinueWatchingStrategy;
