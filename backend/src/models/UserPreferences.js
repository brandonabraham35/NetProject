const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const UserPreferences = sequelize.define('UserPreferences', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    unique: true
  },
  favoriteGenres: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  favoriteActors: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  favoriteDirectors: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  preferredLanguages: {
    type: DataTypes.JSONB,
    defaultValue: []
  },
  averageRuntime: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  preferredMediaType: {
    type: DataTypes.STRING,
    defaultValue: 'mixed'
  },
  mostActiveHours: {
    type: DataTypes.JSONB,
    defaultValue: {}
  }
});

module.exports = UserPreferences;
