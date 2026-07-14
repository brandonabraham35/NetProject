const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const StrategyWeights = sequelize.define('StrategyWeights', {
  strategyName: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  weight: {
    type: DataTypes.FLOAT,
    defaultValue: 1.0
  }
});

module.exports = StrategyWeights;
