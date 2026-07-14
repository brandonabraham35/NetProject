const BaseStrategy = require('./BaseStrategy');
const contentService = require('../../content/services/ContentService');

class ColdStartStrategy extends BaseStrategy {
  constructor() {
    super('ColdStartStrategy');
  }

  async execute(userId, context) {
    try {
      const data = await contentService.getPopularSeries();
      if (!data || !data.results) return [];

      return data.results.slice(0, 5).map((item, idx) => {
        return this.buildRecommendation(
          item,
          50 - idx,
          0.3,
          `Great place to start`
        );
      });
    } catch(e) {
      return [];
    }
  }
}
module.exports = ColdStartStrategy;
