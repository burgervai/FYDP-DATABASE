const { Sequelize } = require('sequelize');
const { centralSequelize, getHospitalSequelize } = require('../config/database');

// Central database models
const db = {
  Sequelize,
  sequelize: centralSequelize,
};

// Import and initialize central models
const Hospital = require('./hospital')(centralSequelize, Sequelize);
db.Hospital = Hospital;

// Central DB models
const User = require('./User');
const PatientInfo = require('./PatientInfo');
const Appointment = require('./Appointment');
const AuditLog = require('./AuditLog');
const BedAllocation = require('./BedAllocation');
const Bed = require('./Bed');
const InventoryItem = require('./InventoryItem');
const Room = require('./Room');
const Ward = require('./Ward');

db.User = User;
db.PatientInfo = PatientInfo;
db.Appointment = Appointment;
db.AuditLog = AuditLog;
db.BedAllocation = BedAllocation;
db.Bed = Bed;
db.InventoryItem = InventoryItem;
db.Room = Room;
db.Ward = Ward;

// Hospital database models
const setupHospitalModels = require('./hospital');

// Function to get hospital models with a specific hospital database connection
const getHospitalDb = (hospitalId) => {
  try {
    const hospitalSequelize = getHospitalSequelize(hospitalId);
    return {
      models: setupHospitalModels(hospitalSequelize),
      sequelize: hospitalSequelize,
    };
  } catch (error) {
    console.error(`Error getting hospital database for hospital ${hospitalId}:`, error);
    throw error;
  }
};

db.getHospitalDb = getHospitalDb;

// Sync function to create all tables if they don't exist
const syncDatabase = async (force = false) => {
  try {
    // Sync central database
    await centralSequelize.sync({ force });
    console.log('Central database synchronized successfully');
    
    // Sync hospital databases
    // Note: In a real application, you might want to get the list of hospitals from the database
    const hospitalIds = [1, 2, 3, 4, 5]; // Example hospital IDs
    for (const hospitalId of hospitalIds) {
      try {
        const { sequelize } = getHospitalDb(hospitalId);
        await sequelize.sync({ force });
        console.log(`Hospital ${hospitalId} database synchronized successfully`);
      } catch (err) {
        console.error(`Error syncing hospital ${hospitalId} database:`, err);
      }
    }
  } catch (error) {
    console.error('Error syncing databases:', error);
    throw error;
  }
};

db.syncDatabase = syncDatabase;

module.exports = db;
