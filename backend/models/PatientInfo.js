// PatientInfo.js - Stores patient medical information
const mongoose = require('mongoose');

const PatientInfoSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  info: { type: Object, required: true }, // Can be expanded for medical fields
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PatientInfo', PatientInfoSchema);
