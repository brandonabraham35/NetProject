const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  avatar: {
    type: DataTypes.STRING,
    defaultValue: '',
  },
  language: {
    type: DataTypes.STRING,
    defaultValue: 'en-US',
  },
  preferences: {
    type: DataTypes.JSONB,
    defaultValue: {},
  }
}, {
  indexes: [
    {
      fields: ['userId']
    }
  ]
});

module.exports = Profile;
