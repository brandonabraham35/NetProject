const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const SearchHistory = sequelize.define('SearchHistory', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: true,
  },
  query: {
    type: DataTypes.STRING,
    allowNull: false,
  }
}, {
  indexes: [
    {
      fields: ['userId']
    },
    {
      fields: ['createdAt'] // Use default timestamp for history tracking
    }
  ]
});

module.exports = SearchHistory;
