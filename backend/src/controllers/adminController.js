const { User } = require('../models');

let dashboardCache = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

const { List } = require('../models');
const { Op } = require('sequelize');
const sequelize = require('../config/database');

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

    const data = {
      totalUsers,
      activeUsers,
      favoritesStatistics: favoritesCount,
      watchHistoryStatistics: watchHistoryCount,
      mostPopularContent: popularContent,
      recentlyRegisteredUsers: recentUsers,
      databaseHealth: 'Healthy',
      apiHealth: 'Healthy',
      cacheStatus: dashboardCache ? 'Hit' : 'Miss (Generated)',
      cachedItems: 1, // just representing the dashboard cache here
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

const clearCache = (req, res) => {
  dashboardCache = null;
  res.status(200).json({ message: 'Content cache cleared successfully' });
};

module.exports = {
  getDashboardOverview,
  getAllUsers,
  getHealthStatus,
  clearCache,
};
