const BaseStrategy = require('./BaseStrategy');
const contentService = require('../../content/services/ContentService');

class RatingStrategy extends BaseStrategy {
  constructor() {
    super('RatingStrategy');
  }

  async execute(userId, context) {
    try {
      const data = await contentService.getPopularMovies(); // Can be expanded to filter strictly by rating
      if (!data || !data.results) return [];

      return data.results
        .filter(item => item.vote_average >= 8)
        .slice(0, 10)
        .map((item, idx) => {
          return this.buildRecommendation(
            item,
            75 - idx,
            0.6,
            `Highly rated critically acclaimed`
          );
      });
    } catch(e) {
      return [];
    }
  }
}
module.exports = RatingStrategy;
