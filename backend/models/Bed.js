const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Room = require('./Room');

const Bed = sequelize.define('Bed', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  room_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'rooms',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  bed_number: {
    type: DataTypes.STRING(16),
    allowNull: false
  },
  is_occupied: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'beds',
  timestamps: false,
  underscored: true
});

Bed.belongsTo(Room, { foreignKey: 'room_id', as: 'room' });
Room.hasMany(Bed, { foreignKey: 'room_id', as: 'beds' });

module.exports = Bed;
