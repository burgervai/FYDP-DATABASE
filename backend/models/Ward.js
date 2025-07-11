const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const Ward = sequelize.define('Ward', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(64),
    allowNull: false
  }
}, {
  tableName: 'wards',
  timestamps: false,
  underscored: true
});

module.exports = Ward;
