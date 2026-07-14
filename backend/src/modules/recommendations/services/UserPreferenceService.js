const { UserPreferences, ContentAnalytics } = require('../../../models');
const contentService = require('../../content/services/ContentService');

class UserPreferenceService {
  async updatePreferencesFromAnalytics(userId) {
    if (!userId) return;

    try {
      const recentViews = await ContentAnalytics.findAll({
        where: { userId, eventType: 'movie_opened' },
        limit: 20,
        order: [['timestamp', 'DESC']]
      });

      if (recentViews.length === 0) return;

      const genresCount = {};

      for (const view of recentViews) {
        try {
          const item = await contentService.getMovie(view.contentId);
          if (item && item.genres) {
            // Depending on Normalizer return, this could be ID or object
            const ids = typeof item.genres[0] === 'object' ? item.genres.map(g => g.id) : item.genres;
            ids.forEach(g => {
              genresCount[g] = (genresCount[g] || 0) + 1;
            });
          }
        } catch (err) {}
      }

      // Sort and take top 5 genres
      const topGenres = Object.entries(genresCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(entry => parseInt(entry[0], 10));

      const [pref, created] = await UserPreferences.findOrCreate({
        where: { userId },
        defaults: { favoriteGenres: topGenres }
      });

      if (!created) {
        pref.favoriteGenres = topGenres;
        await pref.save();
      }

    } catch (err) {
      console.error('Failed to update user preferences:', err.message);
    }
  }
}

module.exports = new UserPreferenceService();
