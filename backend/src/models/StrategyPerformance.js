const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StrategyPerformance = sequelize.define('StrategyPerformance', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  strategyName: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  impressions: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  clicks: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = StrategyPerformance;
