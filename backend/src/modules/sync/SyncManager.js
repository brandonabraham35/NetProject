const cron = require('node-cron');
const contentService = require('../content/services/ContentService');
const logger = require('../../config/logger');

class SyncManager {
  init() {
    logger.info('Initializing Background Synchronization (node-cron)...');

    // Refresh Trending All and Movies every 1 hour
    cron.schedule('0 * * * *', async () => {
      logger.info('Background Sync: Refreshing Trending Data');
      try {
        await contentService.getTrending();
        await contentService.getTrendingMovies();
        await contentService.getTrendingSeries();
      } catch (err) {
        logger.error(`Background Sync failed for Trending: ${err.message}`);
      }
    });

    // Refresh Popular every 2 hours
    cron.schedule('30 */2 * * *', async () => {
      logger.info('Background Sync: Refreshing Popular Data');
      try {
        await contentService.getPopularMovies();
        await contentService.getPopularSeries();
      } catch (err) {
        logger.error(`Background Sync failed for Popular: ${err.message}`);
      }
    });

    // Refresh Genres daily at midnight
    cron.schedule('0 0 * * *', async () => {
      logger.info('Background Sync: Refreshing Genres');
      try {
        await contentService.getGenres();
      } catch (err) {
        logger.error(`Background Sync failed for Genres: ${err.message}`);
      }
    });

    // We can add Recommendation or Analytics aggregation jobs here as required.
  }
}

module.exports = new SyncManager();
