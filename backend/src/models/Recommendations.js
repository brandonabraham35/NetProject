const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Recommendations = sequelize.define('Recommendations', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  recommendedMovieIds: {
    type: DataTypes.ARRAY(DataTypes.STRING),
    defaultValue: []
  }
});

module.exports = Recommendations;
