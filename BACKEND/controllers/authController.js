const PatientRecord = require('../models/PatientModel');
const Doctor = require('../models/doctorModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');

// Create auth controller object
const authController = {};

/**
 * @desc    Login a patient
 * @route   POST /api/auth/login
 * @access  Public
 */
authController.loginUser = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { email, password, role } = req.body;

    if (!email || !password) {
        return res.status(400).json({ 
            success: false,
            message: 'Email and password are required' 
        });
    }

    try {
        let user;
        let userRole = role;

        // If role is provided, use it. Otherwise, try to find the user as a doctor first, then as a patient.
        if (userRole === 'doctor') {
            user = await Doctor.findOne({ email: email.toLowerCase().trim() }).select('+password');
        } else if (userRole === 'patient') {
            user = await PatientRecord.findOne({ email: email.toLowerCase().trim() }).select('+password');
        } else {
            // Attempt to auto-detect role
            user = await Doctor.findOne({ email: email.toLowerCase().trim() }).select('+password');
            if (user) {
                userRole = 'doctor';
            } else {
                user = await PatientRecord.findOne({ email: email.toLowerCase().trim() }).select('+password');
                if (user) {
                    userRole = 'patient';
                }
            }
        }

        if (!user) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials. Please check your email and password.' 
            });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ 
                success: false,
                message: 'Invalid credentials. Please check your email and password.' 
            });
        }

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: userRole },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userWithoutPassword = user.toObject();
        delete userWithoutPassword.password;
        userWithoutPassword.role = userRole; 

        res.status(200).json({
            success: true,
            token,
            user: userWithoutPassword
        });

    } catch (error) {
        console.error('Login error:'.red, error);
        res.status(500).json({ 
            success: false,
            message: 'Internal server error' 
        });
    }
};


/**
 * @desc    Register a new patient
 * @route   POST /api/auth/register
 * @access  Public
 */
authController.registerPatient = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { email, password, patientName, phone, dateOfBirth } = req.body;

    try {
        // Check if user already exists
        let user = await PatientRecord.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create new user
        user = new PatientRecord({
            email,
            password,
            patientName,
            phone,
            dateOfBirth,
            role: 'patient',
            needsProfileCompletion: true
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            token,
            user: userObj
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during registration'
        });
    }
};

authController.registerDoctor = async (req, res) => {
    // Check for validation errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    const { email, password, doctorName, department, specialization, phoneNumber, employeeId } = req.body;

    try {
        // Check if user already exists
        let user = await Doctor.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'Doctor already exists with this email'
            });
        }

        // Create new user
        user = new Doctor({
            email,
            password, // This will be hashed by the pre-save hook in the model
            doctorName,
            department,
            specialization,
            phoneNumber,
            employeeId,
            role: 'doctor'
        });

        await user.save();

        // Create JWT token
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Remove password from response
        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({
            success: true,
            token,
            user: userObj
        });

    } catch (error) {
        console.error('Doctor registration error:', error);
        res.status(500).json({
            success: false,
            message: 'Server error during doctor registration'
        });
    }
};

/**
 * @desc    Get current user
 * @route   GET /api/auth/me
 * @access  Private
 */
authController.getMe = async (req, res) => {
    try {
        // req.user is set by auth middleware
        let user;
        if (req.user.role === 'patient') {
            user = await PatientRecord.findById(req.user.id).select('-password');
        } else if (req.user.role === 'doctor') {
            user = await Doctor.findById(req.user.id).select('-password');
        } else {
            return res.status(400).json({ success: false, message: 'Invalid user role in token' });
        }
        
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }
        
        res.status(200).json({
            success: true,
            user
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({
            success: false,
            message: 'Server error'
        });
    }
};

module.exports = authController;
