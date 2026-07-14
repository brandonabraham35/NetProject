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

    // Recommendation Cache Refresh and User Preferences Update
    // Runs daily at 2:00 AM
    cron.schedule('0 2 * * *', async () => {
      logger.info('Background Sync: Updating User Preferences');
      try {
        const { User } = require('../../models');
        const userPreferenceService = require('../recommendations/services/UserPreferenceService');

        // In a real system, you might paginate or queue this heavily
        const users = await User.findAll({ attributes: ['id'] });
        for (const user of users) {
          await userPreferenceService.updatePreferencesFromAnalytics(user.id);
        }
      } catch (err) {
        logger.error(`Background Sync failed for User Preferences: ${err.message}`);
      }
    });

    // Media Processing Jobs worker
    // Runs every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      logger.info('Background Worker: Checking MediaProcessingJobs');
      try {
        const { MediaProcessingJobs } = require('../../models');
        const pendingJobs = await MediaProcessingJobs.findAll({
          where: { status: 'pending' },
          limit: 10
        });

        for (const job of pendingJobs) {
          logger.info(`Processing job ${job.id} of type ${job.type}`);
          // Mock processing step
          // In reality, we would hook into FFmpeg wrappers or Thumbnail extractors here.
          job.status = 'completed';
          await job.save();
        }
      } catch (err) {
        logger.error(`Background Worker failed for Media Processing: ${err.message}`);
      }
    });
  }
}

module.exports = new SyncManager();
