const sequelize = require('../config/database');
const User = require('./User');
const List = require('./List');

// Define Associations
User.hasMany(List, { foreignKey: 'userId' });
List.belongsTo(User, { foreignKey: 'userId' });

module.exports = {
  sequelize,
  User,
  List,
};
