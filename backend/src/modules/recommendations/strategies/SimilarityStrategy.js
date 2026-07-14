const BaseStrategy = require('./BaseStrategy');
const contentService = require('../../content/services/ContentService');
const { ContinueWatching } = require('../../../models');

class SimilarityStrategy extends BaseStrategy {
  constructor() {
    super('SimilarityStrategy');
  }

  async execute(userId, context) {
    if (!userId) return [];

    // Base similarity on recently watched item
    const recent = await ContinueWatching.findOne({ where: { userId }, order: [['updatedAt', 'DESC']] });
    if (!recent) return [];

    try {
      const similar = await contentService.getRecommendations(recent.movieId);
      if (!similar || !similar.results) return [];

      return similar.results.slice(0, 10).map((item, idx) => {
        return this.buildRecommendation(
          item,
          85 - idx,
          0.8,
          `Similar to what you recently watched`
        );
      });
    } catch(e) {
      return [];
    }
  }
}
module.exports = SimilarityStrategy;
