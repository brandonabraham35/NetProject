const BaseStrategy = require('./BaseStrategy');
const contentService = require('../../content/services/ContentService');

class TrendingStrategy extends BaseStrategy {
  constructor() {
    super('TrendingStrategy');
  }

  async execute(userId, context) {
    // Trending provides baseline generic content
    const data = await contentService.getTrending();
    if (!data || !data.results) return [];

    return data.results.slice(0, 20).map((item, index) => {
      // Score decreases linearly with rank
      const score = 100 - (index * 2);
      return this.buildRecommendation(
        item,
        score,
        0.5,
        'Trending this week globally'
      );
    });
  }
}

module.exports = TrendingStrategy;
