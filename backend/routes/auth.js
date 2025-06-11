// auth.js - Handles registration and login for both roles
const express = require('express');
const router = express.Router();
const { registerPatient, registerDoctor, loginPatient, loginDoctor } = require('../controllers/authController');
const verifyCaptcha = require('../middleware/recaptcha');
const { logAction } = require('../utils/auditLogger');

// Patient routes with CAPTCHA
router.post('/register/patient', verifyCaptcha, registerPatient);
router.post('/login/patient', verifyCaptcha, loginPatient);

// Doctor routes with CAPTCHA
router.post('/register/doctor', verifyCaptcha, registerDoctor);
router.post('/login/doctor', verifyCaptcha, loginDoctor);

module.exports = router;
