const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('netflix_db', 'netflix_user', 'password', {
  host: 'localhost',
  dialect: 'postgres',
  logging: false,
});

module.exports = sequelize;
