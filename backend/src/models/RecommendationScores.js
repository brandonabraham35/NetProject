const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommendationScores = sequelize.define('RecommendationScores', {
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
  score: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  contributingStrategies: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  explanation: {
    type: DataTypes.STRING,
    allowNull: true,
  }
});

module.exports = RecommendationScores;
