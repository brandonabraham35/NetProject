const sequelize = require('../config/database');
const User = require('./User');
const List = require('./List');
const ContentCacheModel = require('./ContentCacheModel');
const Genres = require('./Genres');
const Recommendations = require('./Recommendations');
const SearchHistory = require('./SearchHistory');
const ContinueWatching = require('./ContinueWatching');
const ContentAnalytics = require('./ContentAnalytics');
const Profile = require('./Profile');
const Review = require('./Review');
const Notification = require('./Notification');

// Define Associations
User.hasMany(List, { foreignKey: 'userId', onDelete: 'CASCADE' });
List.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(Recommendations, { foreignKey: 'userId', onDelete: 'CASCADE' });
Recommendations.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(SearchHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
SearchHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(ContinueWatching, { foreignKey: 'userId', onDelete: 'CASCADE' });
ContinueWatching.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(Profile, { foreignKey: 'userId', onDelete: 'CASCADE' });
Profile.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(Review, { foreignKey: 'userId', onDelete: 'CASCADE' });
Review.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(Notification, { foreignKey: 'userId', onDelete: 'CASCADE' });
Notification.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  List,
  ContentCacheModel,
  Genres,
  Recommendations,
  SearchHistory,
  ContinueWatching,
  ContentAnalytics,
  Profile,
  Review,
  Notification,
};
