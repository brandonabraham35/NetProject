const { PlaybackSessions, MediaAccessLogs } = require('../../../models');
const { v4: uuidv4 } = require('uuid');
const logger = require('../../../config/logger');

class PlaybackManager {
  async authorizeSession(userId, contentId) {
    try {
      // In production, enforce concurrency limits here
      const token = uuidv4();

      const session = await PlaybackSessions.create({
        userId,
        contentId: String(contentId),
        token,
        expiresAt: new Date(Date.now() + 4 * 60 * 60 * 1000) // 4 hour expiry
      });

      return session.token;
    } catch (err) {
      logger.error(`Playback Authorization Error: ${err.message}`);
      throw err;
    }
  }

  async validateToken(token, contentId) {
    const session = await PlaybackSessions.findOne({ where: { token, contentId: String(contentId) } });
    if (!session || new Date() > session.expiresAt) {
      return false;
    }
    return session.userId;
  }

  async logAccess(userId, contentId, bytesTransferred) {
    try {
      // Typically aggregated in memory then flushed, simplified here
      await MediaAccessLogs.create({ userId, contentId, bytesTransferred });
    } catch(e) {}
  }
}

module.exports = new PlaybackManager();
