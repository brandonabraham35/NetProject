const { Review } = require('../models');
const logger = require('../config/logger');

exports.createReview = async (req, res) => {
  try {
    const firebaseUid = req.user.firebaseUid;
    const { User } = require('../models');
    const user = await User.findOne({ where: { firebaseUid } });
    if (!user) return res.status(404).json({ error: 'User not found' });

    const { contentId, rating, comment } = req.body;
    if (!contentId || !rating) return res.status(400).json({ error: 'contentId and rating are required' });

    const review = await Review.create({
      userId: user.id,
      contentId: String(contentId),
      rating,
      comment
    });

    res.status(201).json({ review });
  } catch (error) {
    logger.error(`Error creating review: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};

exports.getReviews = async (req, res) => {
  try {
    const { contentId } = req.params;
    const reviews = await Review.findAll({
      where: { contentId: String(contentId) },
      order: [['createdAt', 'DESC']]
    });
    res.status(200).json({ reviews });
  } catch (error) {
    logger.error(`Error fetching reviews: ${error.message}`);
    res.status(500).json({ error: 'Internal server error' });
  }
};
