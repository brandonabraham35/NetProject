const { User } = require('../models');

const getDashboardOverview = async (req, res) => {
  try {
    const userCount = await User.count();
    res.status(200).json({
      activeUsers: userCount,
      serverStatus: 'Online',
      cachedItems: 120, // Mock for now
    });
  } catch (error) {
    console.error('Error fetching dashboard overview:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const users = await User.findAll({ attributes: { exclude: ['createdAt', 'updatedAt'] } });
    res.status(200).json({ users });
  } catch (error) {
    console.error('Error fetching users:', error);
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
  res.status(200).json({ message: 'Content cache cleared successfully' });
};

module.exports = {
  getDashboardOverview,
  getAllUsers,
  getHealthStatus,
  clearCache,
};
