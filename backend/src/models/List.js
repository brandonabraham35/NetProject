const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const List = sequelize.define('List', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  type: {
    type: DataTypes.STRING,
    allowNull: false, // e.g., 'MyList', 'LikedMovies', 'WatchedMovies', 'ContinueWatching'
  },
  movieData: {
    type: DataTypes.JSONB, // Store TMDB movie object directly
    allowNull: false,
  },
  movieId: {
    type: DataTypes.STRING, // To easily check if a movie is in the list
    allowNull: false,
  }
});

module.exports = List;
