const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContentCacheModel = sequelize.define('ContentCache', {
  key: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  value: {
    type: DataTypes.JSONB,
    allowNull: false,
  },
  expiresAt: {
    type: DataTypes.DATE,
    allowNull: false,
  }
}, {
  indexes: [
    {
      fields: ['key']
    },
    {
      fields: ['expiresAt']
    }
  ]
});

module.exports = ContentCacheModel;
