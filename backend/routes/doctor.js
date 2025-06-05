// doctor.js - Doctor-specific routes
const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth, role('doctor'));
router.get('/patients', doctorController.getAllPatients);

module.exports = router;
