const express = require('express');
const router = express.Router();

// Import route files
const authRoutes = require('./auth');
const patientRoutes = require('./patient');
const doctorRoutes = require('./doctor');
const appointmentRoutes = require('./appointmentRoutes');
const emrRoutes = require('./emrRoutes');
const inventoryRoutes = require('./inventoryRoutes');
const pharmacyRoutes = require('./pharmacyRoutes');
const bedRoutes = require('./bedRoutes');
const healthRoutes = require('./healthRoutes');
const verificationRoutes = require('./verificationRoutes');
const testRoutes = require('./test');

// Test routes (no auth required)
router.use('/test', testRoutes);

// API Routes
router.use('/api/auth', authRoutes);
router.use('/api/patients', patientRoutes);
router.use('/api/doctors', doctorRoutes);
router.use('/api/appointments', appointmentRoutes);
router.use('/api/emr', emrRoutes);
router.use('/api/inventory', inventoryRoutes);
router.use('/api/pharmacy', pharmacyRoutes);
router.use('/api/beds', bedRoutes);
router.use('/api/health', healthRoutes);
router.use('/api/verify', verificationRoutes);
router.use('/health', healthRoutes);
router.use('/verify', verificationRoutes);

module.exports = router;
