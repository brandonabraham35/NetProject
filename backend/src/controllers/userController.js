const { List } = require('../models');

const getList = async (req, res) => {
  try {
    const { type } = req.params;
    const firebaseUid = req.user.firebaseUid; // The auth middleware only populates firebaseUid and email on req.user initially

    // Find internal user by firebaseUid to get their internal UUID
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const userId = user.id;

    const listItems = await List.findAll({
      where: { userId, type },
    });

    const movies = listItems.map(item => item.movieData);

    res.status(200).json({ movies });
  } catch (error) {
    console.error('Error fetching list:', error);
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

    if (!existing) {
      await List.create({
        userId,
        type,
        movieData,
        movieId,
      });
    }

    res.status(200).json({ message: 'Added to list successfully' });
  } catch (error) {
    console.error('Error adding to list:', error);
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
    console.error('Error removing from list:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};

module.exports = {
  getList,
  addToList,
  removeFromList,
};
