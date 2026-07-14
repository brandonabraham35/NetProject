const BaseStrategy = require('./BaseStrategy');
const contentService = require('../../content/services/ContentService');

class PopularityStrategy extends BaseStrategy {
  constructor() {
    super('PopularityStrategy');
  }

  async execute(userId, context) {
    try {
      const data = await contentService.getPopularMovies();
      if (!data || !data.results) return [];

      return data.results.slice(0, 15).map((item, idx) => {
        return this.buildRecommendation(
          item,
          70 - idx,
          0.5,
          `Popular globally right now`
        );
      });
    } catch(e) {
      return [];
    }
  }
}
module.exports = PopularityStrategy;
