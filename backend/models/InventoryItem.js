const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');

const InventoryItem = sequelize.define('InventoryItem', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(128),
    allowNull: false
  },
  description: DataTypes.TEXT,
  quantity: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  unit: DataTypes.STRING(32),
  last_updated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'inventory_items',
  timestamps: false,
  underscored: true
});

module.exports = InventoryItem;
