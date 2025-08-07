const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/db');
const Bed = require('./Bed');
const Patient = require('./Patient');

const BedAllocation = sequelize.define('BedAllocation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  bed_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'beds',
      key: 'id',
    },
    onDelete: 'CASCADE',
  },
  patient_id: {
    type: DataTypes.INTEGER,
    references: {
      model: 'patients',
      key: 'id',
    },
    onDelete: 'SET NULL',
  },
  start_time: DataTypes.DATE,
  end_time: DataTypes.DATE
}, {
  tableName: 'bed_allocations',
  timestamps: false,
  underscored: true
});

BedAllocation.belongsTo(Bed, { foreignKey: 'bed_id', as: 'bed' });
Bed.hasMany(BedAllocation, { foreignKey: 'bed_id', as: 'allocations' });
BedAllocation.belongsTo(Patient, { foreignKey: 'patient_id', as: 'patient' });
Patient.hasMany(BedAllocation, { foreignKey: 'patient_id', as: 'bedAllocations' });

module.exports = BedAllocation;
