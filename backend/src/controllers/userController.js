const { List } = require('../models');

const logger = require('../config/logger');

const { SearchHistory, ContinueWatching, Profile, Notification } = require('../models');

const getNotifications = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const notifications = await Notification.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']]
    });

    res.status(200).json({ notifications });
  } catch (error) {
    logger.error(`Error fetching notifications: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getProfiles = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const profiles = await Profile.findAll({ where: { userId: user.id } });

    // Automatically create a default profile if none exist
    if (profiles.length === 0) {
      const defaultProfile = await Profile.create({
        userId: user.id,
        name: 'Default',
        preferences: {}
      });
      return res.status(200).json({ profiles: [defaultProfile] });
    }

    res.status(200).json({ profiles });
  } catch (error) {
    logger.error(`Error fetching profiles: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const createProfile = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { name, avatar, language, preferences } = req.body;

    // Limit profiles per user
    const profileCount = await Profile.count({ where: { userId: user.id } });
    if (profileCount >= 5) {
      return res.status(400).json({ error: 'Maximum of 5 profiles allowed' });
    }

    const profile = await Profile.create({
      userId: user.id,
      name: name || `Profile ${profileCount + 1}`,
      avatar: avatar || '',
      language: language || 'en-US',
      preferences: preferences || {}
    });

    res.status(201).json({ profile });
  } catch (error) {
    logger.error(`Error creating profile: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const updateProgress = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { movieId, progress } = req.body;
    if (!movieId || progress === undefined) {
      return res.status(400).json({ error: 'movieId and progress are required' });
    }

    const existing = await ContinueWatching.findOne({
      where: { userId: user.id, movieId: String(movieId) }
    });

    if (existing) {
      existing.progress = progress;
      await existing.save();
    } else {
      await ContinueWatching.create({
        userId: user.id,
        movieId: String(movieId),
        progress
      });
    }

    res.status(200).json({ message: 'Progress updated successfully' });
  } catch (error) {
    logger.error(`Error updating progress: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeProgress = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { movieId } = req.params;

    await ContinueWatching.destroy({
      where: { userId: user.id, movieId: String(movieId) }
    });

    res.status(200).json({ message: 'Progress removed successfully' });
  } catch (error) {
    logger.error(`Error removing progress: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getList = async (req, res) => {
  try {
    const { type } = req.params;
    const firebaseUid = req.user.firebaseUid; // The auth middleware only populates firebaseUid and email on req.user initially

    // Find internal user by firebaseUid to get their internal UUID
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userId = user.id;

    const limit = parseInt(req.query.limit, 10) || 50;
    const offset = parseInt(req.query.offset, 10) || 0;

    const listItems = await List.findAll({
      where: { userId, type },
      limit,
      offset
    });

    const movies = listItems.map(item => item.movieData);

    res.status(200).json({ movies });
  } catch (error) {
    logger.error(`Error fetching list: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const addToList = async (req, res) => {
  try {
    const { type } = req.params;
    const firebaseUid = req.user.firebaseUid;

    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userId = user.id;
    const movieData = req.body;

    if (!movieData || !movieData.id) {
      return res.status(400).json({ error: 'Valid movie object with id is required' });
    }

    const movieId = movieData.id.toString();

    const existing = await List.findOne({
      where: { userId, type, movieId }
    });

    if (existing) {
      return res.status(409).json({ error: 'Movie is already in the list' });
    }

    await List.create({
      userId,
      type,
      movieData,
      movieId,
    });

    res.status(200).json({ message: 'Added to list successfully' });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Movie is already in the list' });
    }
    logger.error(`Error adding to list: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const removeFromList = async (req, res) => {
  try {
    const { type } = req.params;
    const firebaseUid = req.user.firebaseUid;

    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userId = user.id;
    const movieData = req.body;

    if (!movieData || !movieData.id) {
      return res.status(400).json({ error: 'Valid movie object with id is required' });
    }

    const movieId = movieData.id.toString();

    await List.destroy({
      where: { userId, type, movieId }
    });

    res.status(200).json({ message: 'Removed from list successfully' });
  } catch (error) {
    logger.error(`Error removing from list: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const getSearchHistory = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const history = await SearchHistory.findAll({
      where: { userId: user.id },
      order: [['createdAt', 'DESC']],
      attributes: ['id', 'query', 'createdAt']
    });
    res.status(200).json({ history });
  } catch (error) {
    logger.error(`Error fetching search history: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

const clearSearchHistory = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    await SearchHistory.destroy({ where: { userId: user.id } });
    res.status(200).json({ message: 'Search history cleared successfully' });
  } catch (error) {
    logger.error(`Error clearing search history: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getNotifications,
  getProfiles,
  createProfile,
  updateProgress,
  removeProgress,
  getList,
  addToList,
  removeFromList,
  getSearchHistory,
  clearSearchHistory
};
