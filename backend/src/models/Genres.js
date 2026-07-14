const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Genres = sequelize.define('Genres', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  }
});

module.exports = Genres;
