const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const ContinueWatching = sequelize.define('ContinueWatching', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  movieId: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  progress: {
    type: DataTypes.FLOAT,
    defaultValue: 0.0,
  }
});

module.exports = ContinueWatching;
