const { ContentCacheModel } = require('../../../models');
const { Op } = require('sequelize');
const logger = require('../../../config/logger');

class ContentCache {
  constructor() {
    this.defaultTTL = 15 * 60 * 1000; // 15 minutes default for database cache
  }

  async get(key) {
    try {
      const item = await ContentCacheModel.findByPk(key);
      if (!item) return null;

      // If expired, return null but keep it in DB temporarily as a fallback
      if (new Date() > item.expiresAt) {
        return { value: item.value, isExpired: true };
      }
      return { value: item.value, isExpired: false };
    } catch (err) {
      logger.error(`Cache Read Error: ${err.message}`);
      return null;
    }
  }

  async set(key, value, ttl = this.defaultTTL) {
    try {
      await ContentCacheModel.upsert({
        key,
        value,
        expiresAt: new Date(Date.now() + ttl)
      });
    } catch (err) {
      logger.error(`Cache Write Error: ${err.message}`);
    }
  }

  async clear() {
    try {
      await ContentCacheModel.destroy({ where: {} });
    } catch (err) {
      logger.error(`Cache Clear Error: ${err.message}`);
    }
  }

  async getStatus() {
    try {
      const count = await ContentCacheModel.count();
      return {
        size: count,
        status: 'Healthy'
      };
    } catch (err) {
      return { size: 0, status: 'Error' };
    }
  }
}

// Export a singleton instance
module.exports = new ContentCache();
