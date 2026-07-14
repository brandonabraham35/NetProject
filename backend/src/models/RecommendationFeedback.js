const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommendationFeedback = sequelize.define('RecommendationFeedback', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  contentId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  action: {
    type: DataTypes.STRING, // 'clicked', 'watched', 'dismissed', 'thumbs_up', 'thumbs_down'
    allowNull: false,
  },
  strategyId: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = RecommendationFeedback;
