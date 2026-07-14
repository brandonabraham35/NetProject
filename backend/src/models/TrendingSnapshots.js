const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const TrendingSnapshots = sequelize.define('TrendingSnapshots', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  period: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  items: {
    type: DataTypes.JSONB,
    defaultValue: []
  }
});

module.exports = TrendingSnapshots;
