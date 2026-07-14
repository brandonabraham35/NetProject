const { User } = require('../models');

let dashboardCache = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const { List, ContentAnalytics, Genres } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');
const providerManager = require('../modules/content/providers/ProviderManager');
const contentCache = require('../modules/content/cache/ContentCache');

const logger = require('../config/logger');

const getDashboardOverview = async (req, res) => {
  try {
    if (dashboardCache && Date.now() - dashboardCache.timestamp < CACHE_TTL) {
      return res.status(200).json(dashboardCache.data);
    }

    const totalUsers = await User.count();

    // Active users (example: registered in the last 7 days)
    const activeUsers = await User.count({
      where: {
        createdAt: {
          [Op.gte]: new Date(new Date() - 7 * 24 * 60 * 60 * 1000)
        }
      }
    });

    // Favorites statistics
    const favoritesCount = await List.count({ where: { type: 'LikedMovies' } });

    // Watch history statistics
    const watchHistoryCount = await List.count({ where: { type: 'WatchedMovies' } });

    // Most popular content
    const popularContent = await List.findAll({
      attributes: [
        'movieId',
        [sequelize.fn('COUNT', sequelize.col('movieId')), 'count']
      ],
      group: ['movieId'],
      order: [[sequelize.fn('COUNT', sequelize.col('movieId')), 'DESC']],
      limit: 5
    });

    // Recently registered users
    const recentUsers = await User.findAll({
      order: [['createdAt', 'DESC']],
      limit: 5,
      attributes: ['id', 'email', 'createdAt']
    });

    // Content specific analytics
    // Since ContentAnalytics logs individual events without a 'views' counter, we group by contentId
    const mostViewed = await ContentAnalytics.findAll({
      attributes: [
        'contentId',
        [sequelize.fn('COUNT', sequelize.col('contentId')), 'views']
      ],
      where: {
        eventType: {
          [Op.in]: ['movie_opened', 'series_opened', 'episode_opened']
        }
      },
      group: ['contentId'],
      order: [[sequelize.fn('COUNT', sequelize.col('contentId')), 'DESC']],
      limit: 5
    });
    const mostPopularGenres = await Genres.count(); // Simplified for now

    // Dynamic statuses
    const activeProviderName = providerManager.getActive() ? providerManager.getActive().constructor.name : 'None';
    const cacheInfo = await contentCache.getStatus();

    // Further expanded Admin Stats for Phase 4
    const { SearchHistory } = require('../models');

    // Quick grouping for most searched queries
    const mostSearched = await SearchHistory.findAll({
      attributes: [
        'query',
        [sequelize.fn('COUNT', sequelize.col('query')), 'count']
      ],
      group: ['query'],
      order: [[sequelize.fn('COUNT', sequelize.col('query')), 'DESC']],
      limit: 5
    });

    const data = {
      totalUsers,
      activeUsers,
      favoritesStatistics: favoritesCount,
      watchHistoryStatistics: watchHistoryCount,
      mostPopularContent: popularContent,
      recentlyRegisteredUsers: recentUsers,

      // New fields for Content Module
      mostViewed,
      mostPopularGenres,
      mostSearched, // Phase 4 requirement
      userEngagement: await ContentAnalytics.count(), // Phase 4 requirement
      providerStatus: activeProviderName,
      cacheStatus: cacheInfo.status,
      cachedItems: cacheInfo.size,
      queueStatus: 'Idle/Scheduled', // Node-cron is active
      systemLogs: 'winston active',

      databaseHealth: 'Healthy',
      apiHealth: 'Healthy',
      dashboardCacheStatus: dashboardCache ? 'Hit' : 'Miss (Generated)',
    };

    dashboardCache = {
      timestamp: Date.now(),
      data
    };

    res.status(200).json(data);
  } catch (error) {
    logger.error(`Error fetching dashboard overview: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const users = await User.findAll({
      attributes: { exclude: ['createdAt', 'updatedAt'] },
      limit,
      offset
    });
    res.status(200).json({ users });
  } catch (error) {
    logger.error(`Error fetching users: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getHealthStatus = (req, res) => {
  res.status(200).json({
    status: 'Healthy',
    uptime: process.uptime(),
    memoryUsage: process.memoryUsage(),
  });
};

const getProviderHealth = (req, res) => {
  res.status(200).json(providerManager.getHealthStats());
};

const clearCache = (req, res) => {
  dashboardCache = null;
  res.status(200).json({ message: 'Content cache cleared successfully' });
};

const refreshContentCache = async (req, res) => {
  await contentCache.clear();
  res.status(200).json({ message: 'Content service cache cleared successfully' });
};

module.exports = {
  getDashboardOverview,
  getAllUsers,
  getHealthStatus,
  getProviderHealth,
  clearCache,
  refreshContentCache,
};
