// patient.js - Patient-specific routes
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const { authenticate, requireRole } = require('../middleware/auth');

// Patient can only access their own infoouter.get('/me', authenticate, requireRole('patient'), patientController.getOwnInfo);

module.exports = router;
