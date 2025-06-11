// doctor.js - Doctor-specific routes
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { authenticate, requireRole } = require('../middleware/auth');

// Doctor can view all patients
router.get('/patients', authenticate, requireRole('doctor'), doctorController.getAllPatients);

module.exports = router;
