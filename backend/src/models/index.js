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

const UserPreferences = require('./UserPreferences');
const RecommendationScores = require('./RecommendationScores');
const RecommendationHistory = require('./RecommendationHistory');
const RecommendationFeedback = require('./RecommendationFeedback');
const TrendingSnapshots = require('./TrendingSnapshots');
const GenreStatistics = require('./GenreStatistics');
const StrategyWeights = require('./StrategyWeights');
const StrategyPerformance = require('./StrategyPerformance');

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

User.hasOne(UserPreferences, { foreignKey: 'userId', onDelete: 'CASCADE' });
UserPreferences.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(RecommendationScores, { foreignKey: 'userId', onDelete: 'CASCADE' });
RecommendationScores.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(RecommendationHistory, { foreignKey: 'userId', onDelete: 'CASCADE' });
RecommendationHistory.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

User.hasMany(RecommendationFeedback, { foreignKey: 'userId', onDelete: 'CASCADE' });
RecommendationFeedback.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

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
  UserPreferences,
  RecommendationScores,
  RecommendationHistory,
  RecommendationFeedback,
  TrendingSnapshots,
  GenreStatistics,
  StrategyWeights,
  StrategyPerformance,
};
