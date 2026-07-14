const BaseStrategy = require('./BaseStrategy');
const { SearchHistory } = require('../../../models');
const contentService = require('../../content/services/ContentService');

class SearchHistoryStrategy extends BaseStrategy {
  constructor() {
    super('SearchHistoryStrategy');
  }

  async execute(userId, context) {
    if (!userId) return [];

    const searches = await SearchHistory.findAll({
      where: { userId },
      order: [['createdAt', 'DESC']],
      limit: 1
    });

    if (searches.length === 0) return [];

    try {
      const results = await contentService.search(searches[0].query);
      if (!results || !results.results) return [];

      return results.results.slice(0, 10).map((item, idx) => {
        const score = 85 - (idx * 3);
        return this.buildRecommendation(
          item,
          score,
          0.7,
          `Based on your recent search for "${searches[0].query}"`
        );
      });
    } catch(e) {
      return [];
    }
  }
}

module.exports = SearchHistoryStrategy;
