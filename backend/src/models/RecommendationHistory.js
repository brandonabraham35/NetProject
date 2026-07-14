const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const RecommendationHistory = sequelize.define('RecommendationHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  recommendedItems: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  context: {
    type: DataTypes.STRING,
    allowNull: true
  }
});

module.exports = RecommendationHistory;
