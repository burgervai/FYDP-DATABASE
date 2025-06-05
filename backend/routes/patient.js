// patient.js - Patient-specific routes
const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');
const auth = require('../middleware/auth');
const role = require('../middleware/role');

router.use(auth, role('patient'));
router.post('/info', patientController.uploadInfo);
router.get('/info', patientController.getOwnInfo);

module.exports = router;
