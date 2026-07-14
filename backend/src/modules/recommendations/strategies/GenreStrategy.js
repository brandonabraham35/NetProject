const BaseStrategy = require('./BaseStrategy');
const { Profile } = require('../../../models');
const contentService = require('../../content/services/ContentService');

class GenreStrategy extends BaseStrategy {
  constructor() {
    super('GenreStrategy');
  }

  async execute(userId, context) {
    if (!userId) return [];

    const profile = await Profile.findOne({ where: { userId }, order: [['createdAt', 'ASC']] });
    const favGenres = profile?.preferences?.genres || [];

    if (favGenres.length === 0) return [];

    try {
      const data = await contentService.discover('movie', { with_genres: favGenres.join(',') });
      if (!data || !data.results) return [];

      return data.results.slice(0, 15).map((item, idx) => {
        return this.buildRecommendation(
          item,
          80 - (idx * 2),
          0.75,
          `Based on your favorite genres`
        );
      });
    } catch(e) {
      return [];
    }
  }
}

module.exports = GenreStrategy;
