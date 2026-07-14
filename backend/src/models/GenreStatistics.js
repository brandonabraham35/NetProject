const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GenreStatistics = sequelize.define('GenreStatistics', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  genreId: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  views: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  }
});

module.exports = GenreStatistics;
