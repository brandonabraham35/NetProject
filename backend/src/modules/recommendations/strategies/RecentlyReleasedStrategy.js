const BaseStrategy = require('./BaseStrategy');
const contentService = require('../../content/services/ContentService');

class RecentlyReleasedStrategy extends BaseStrategy {
  constructor() {
    super('RecentlyReleasedStrategy');
  }

  async execute(userId, context) {
    try {
      const data = await contentService.getUpcoming(); // Using upcoming as proxy for new/recently released
      if (!data || !data.results) return [];

      return data.results.slice(0, 15).map((item, idx) => {
        return this.buildRecommendation(
          item,
          65 - idx,
          0.6,
          `New and recently released`
        );
      });
    } catch(e) {
      return [];
    }
  }
}
module.exports = RecentlyReleasedStrategy;
