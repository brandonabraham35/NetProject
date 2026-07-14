const recommendationService = require('../services/RecommendationService');
const logger = require('../../../config/logger');

exports.getRecommendations = async (req, res) => {
  try {
    const userId = req.user?.id; // from auth middleware, could be undefined if optionalAuth
    const data = await recommendationService.getPersonalizedRecommendations(userId);
    res.status(200).json(data);
  } catch (error) {
    logger.error(`Recommendation Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to fetch recommendations' });
  }
};

exports.getBecauseYouWatched = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await recommendationService.getPersonalizedRecommendations(userId);
    // Wrap to match TMDB { results: [] } format expected by frontend RowPost
    res.status(200).json({ results: data.becauseYouWatched });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
};

exports.postFeedback = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { RecommendationFeedback, User } = require('../../../models');

    // Auth context holds firebaseUid, we need to map to internal userId if needed,
    // or assume req.user.id was hydrated by middleware. Assuming middleware hydrates `req.user.id`.
    let dbUserId = userId;
    if (!dbUserId && req.user?.firebaseUid) {
       const user = await User.findOne({ where: { firebaseUid: req.user.firebaseUid } });
       dbUserId = user?.id;
    }

    if (!dbUserId) return res.status(401).json({ error: 'Unauthorized' });

    const { contentId, action, strategyId } = req.body;

    if (!contentId || !action) {
      return res.status(400).json({ error: 'contentId and action are required' });
    }

    await RecommendationFeedback.create({
      userId: dbUserId,
      contentId: String(contentId),
      action,
      strategyId
    });

    res.status(201).json({ message: 'Feedback recorded' });
  } catch (error) {
    logger.error(`Feedback Error: ${error.message}`);
    res.status(500).json({ error: 'Failed to record feedback' });
  }
};

exports.getTopPicks = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await recommendationService.getPersonalizedRecommendations(userId);
    res.status(200).json({ results: data.topPicksForYou });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
};

exports.getContinueWatching = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await recommendationService.getPersonalizedRecommendations(userId);
    // cw currently has a different format [{ id, progress }], but we will map the actual content if possible
    // or return it as-is if handled. For now, fallback to topPicks format to prevent UI breaking if mapped directly
    res.status(200).json({ results: data.continueWatching });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
};

exports.getTrendingForUser = async (req, res) => {
  try {
    const userId = req.user?.id;
    const data = await recommendationService.getPersonalizedRecommendations(userId);
    res.status(200).json({ results: data.trendingForUser });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch' });
  }
};
