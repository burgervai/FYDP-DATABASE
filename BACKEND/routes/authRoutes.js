const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { auth } = require('../middleware/auth');
const validateRequest = require('../middleware/validateRequest');

// Input validation middleware
const validateLogin = [
    body('email').isString().trim().isEmail().withMessage('Please include a valid email'),
    body('password').isString().notEmpty().withMessage('Password is required'),
    // role is optional; when absent or invalid, controller will infer
    body('role').optional().isString().withMessage('Role must be a string if provided')
];

const validateRegister = [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Please enter a password with 6 or more characters'),
    body('patientName').not().isEmpty().withMessage('Please add your name'),
    body('phone').not().isEmpty().withMessage('Please add your phone number'),
    body('dateOfBirth').isISO8601().withMessage('Please add a valid date of birth')
];

const validateDoctorRegister = [
    body('email').isEmail().withMessage('Please include a valid email'),
    body('password').isLength({ min: 6 }).withMessage('Please enter a password with 6 or more characters'),
    body('doctorName').not().isEmpty().withMessage('Please add your name'),
    body('department').not().isEmpty().withMessage('Please add a department'),
    body('specialization').not().isEmpty().withMessage('Please add a specialization'),
    body('phoneNumber').not().isEmpty().withMessage('Please add your phone number'),
    body('employeeId').not().isEmpty().withMessage('Please add your employee ID'),
];

// Public routes
router.post('/login', validateRequest(validateLogin), authController.loginUser);
router.post('/register', validateRegister, authController.registerPatient);
router.post('/register/doctor', validateDoctorRegister, authController.registerDoctor);

// Protected route - requires authentication
router.get('/me', auth, authController.getMe);

module.exports = router;
