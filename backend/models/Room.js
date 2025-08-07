const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Ward = require('./Ward');

const Room = sequelize.define('Room', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  ward_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'wards',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  room_number: {
    type: DataTypes.STRING(16),
    allowNull: false
  }
}, {
  tableName: 'rooms',
  timestamps: false,
  underscored: true
});

Room.belongsTo(Ward, { foreignKey: 'ward_id', as: 'ward' });
Ward.hasMany(Room, { foreignKey: 'ward_id', as: 'rooms' });

module.exports = Room;
