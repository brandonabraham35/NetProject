const sequelize = require('../config/database');
const User = require('./User');
const List = require('./List');

// Define Associations
User.hasMany(List, { foreignKey: 'userId', onDelete: 'CASCADE' });
List.belongsTo(User, { foreignKey: 'userId', onDelete: 'CASCADE' });

module.exports = {
  sequelize,
  User,
  List,
};
