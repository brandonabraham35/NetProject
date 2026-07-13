const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentAnalytics = sequelize.define('ContentAnalytics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  contentId: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  provider: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'tmdb',
  },
  eventType: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  }
}, {
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['contentId']
    },
    {
      fields: ['eventType']
    }
  ]
});

module.exports = ContentAnalytics;
