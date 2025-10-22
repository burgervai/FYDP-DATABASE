const Doctor = require("../models/doctorModel");
const { validationResult } = require('express-validator');

/**
 * @desc    Create a new doctor
 * @route   POST /api/doctors
 * @access  Private/Admin
 */
const createDoctor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {
        const newDoctor = new Doctor(req.body);
        const savedDoctor = await newDoctor.save();
        
        res.status(201).json({
            success: true,
            data: savedDoctor
        });
    } catch (error) {
        console.error('Error creating doctor:', error);
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to create doctor',
            error: error.message
        });
    }
};

/**
 * @desc    Update doctor's active status
 * @route   PATCH /api/doctors/:id/status
 * @access  Private/Admin
 */
const updateDoctorStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { isActive } = req.body;

        const updated = await Doctor.findByIdAndUpdate(
            id,
            { isActive: Boolean(isActive), updatedAt: Date.now() },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        return res.status(200).json({ success: true, data: updated });
    } catch (error) {
        console.error('Error updating doctor status:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
        }
        return res.status(500).json({ success: false, message: 'Failed to update doctor status', error: error.message });
    }
};

/**
 * @desc    Add/update doctor's rating (incremental average)
 * @route   PATCH /api/doctors/:id/rating
 * @access  Private/Patient
 */
const updateDoctorRating = async (req, res) => {
    try {
        const { id } = req.params;
        const { rating } = req.body;

        const doctor = await Doctor.findById(id);
        if (!doctor) {
            return res.status(404).json({ success: false, message: 'Doctor not found' });
        }

        const currentTotal = doctor.rating.average * doctor.rating.count;
        const newCount = doctor.rating.count + 1;
        const newAverage = (currentTotal + Number(rating)) / newCount;

        doctor.rating.average = Number(newAverage.toFixed(2));
        doctor.rating.count = newCount;
        doctor.updatedAt = Date.now();
        await doctor.save();

        return res.status(200).json({ success: true, data: doctor });
    } catch (error) {
        console.error('Error updating doctor rating:', error);
        if (error.name === 'CastError') {
            return res.status(400).json({ success: false, message: 'Invalid doctor ID' });
        }
        return res.status(500).json({ success: false, message: 'Failed to update doctor rating', error: error.message });
    }
};

/**
 * @desc    Get all doctors (with filtering, sorting, pagination)
 * @route   GET /api/doctors
 * @access  Public
 */
const getAllDoctors = async (req, res) => {
    try {
        // Build query
        const query = {};
        
        // Filter by department if provided
        if (req.query.department) {
            query.department = { $regex: req.query.department, $options: 'i' };
        }
        
        // Filter by active status (default to active only)
        if (req.query.active === 'false') {
            query.isActive = false;
        } else {
            query.isActive = true;
        }
        
        // Execute query with sorting and pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        
        const [doctors, total] = await Promise.all([
            Doctor.find(query)
                .sort({ doctorName: 1 })
                .skip(skip)
                .limit(limit),
            Doctor.countDocuments(query)
        ]);
        
        // Calculate pagination metadata
        const totalPages = Math.ceil(total / limit);
        const hasNextPage = page < totalPages;
        const hasPreviousPage = page > 1;
        
        res.status(200).json({
            success: true,
            count: doctors.length,
            total,
            page,
            totalPages,
            hasNextPage,
            hasPreviousPage,
            data: doctors
        });
    } catch (error) {
        console.error('Error fetching doctors:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctors',
            error: error.message
        });
    }
};

/**
 * @desc    Get single doctor by ID
 * @route   GET /api/doctors/:id
 * @access  Public
 */
const getDoctorById = async (req, res) => {
    try {
        const doctor = await Doctor.findById(req.params.id)

            
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error fetching doctor:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor',
            error: error.message
        });
    }
};

/**
 * @desc    Update a doctor
 * @route   PUT /api/doctors/:id
 * @access  Private/Admin
 */
const updateDoctor = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    try {

        
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { ...req.body, updatedAt: Date.now() },
            { new: true, runValidators: true }
        );
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: doctor
        });
    } catch (error) {
        console.error('Error updating doctor:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }
        
        // Handle duplicate key errors
        if (error.code === 11000) {
            const field = Object.keys(error.keyPattern)[0];
            return res.status(400).json({
                success: false,
                message: `${field} already exists`
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to update doctor',
            error: error.message
        });
    }
};

/**
 * @desc    Delete a doctor (soft delete)
 * @route   DELETE /api/doctors/:id
 * @access  Private/Admin
 */
const deleteDoctor = async (req, res) => {
    try {
        const doctor = await Doctor.findByIdAndUpdate(
            req.params.id,
            { isActive: false, updatedAt: Date.now() },
            { new: true }
        );
        
        if (!doctor) {
            return res.status(404).json({
                success: false,
                message: 'Doctor not found'
            });
        }
        
        res.status(200).json({
            success: true,
            data: {}
        });
    } catch (error) {
        console.error('Error deleting doctor:', error);
        
        if (error.name === 'CastError') {
            return res.status(400).json({
                success: false,
                message: 'Invalid doctor ID'
            });
        }
        
        res.status(500).json({
            success: false,
            message: 'Failed to delete doctor',
            error: error.message
        });
    }
};

/**
 * @desc    Get doctors by department
 * @route   GET /api/doctors/department/:department
 * @access  Public
 */
const getDoctorsByDepartment = async (req, res) => {
    try {
        const { department } = req.params;
        const query = { department: { $regex: department, $options: 'i' }, isActive: true };
        const doctors = await Doctor.find(query).sort({ doctorName: 1 });
        return res.status(200).json({ success: true, count: doctors.length, data: doctors });
    } catch (error) {
        console.error('Error fetching doctors by department:', error);
        return res.status(500).json({ success: false, message: 'Failed to fetch doctors by department', error: error.message });
    }
};

/**
 * @desc    Get doctor statistics
 * @route   GET /api/doctors/stats
 * @access  Private/Admin
 */
const getDoctorStats = async (req, res) => {
    try {
        const stats = await Doctor.aggregate([
            {
                $match: { isActive: true }
            },
            {
                $group: {
                    _id: '$department',
                    count: { $sum: 1 },
                    averageRating: { $avg: '$rating.average' },
                    totalExperience: { $sum: '$yearsOfExperience' || 0 }
                }
            },
            {
                $sort: { count: -1 }
            }
        ]);
        
        const totalDoctors = await Doctor.countDocuments({ isActive: true });
        
        res.status(200).json({
            success: true,
            data: {
                totalDoctors,
                byDepartment: stats
            }
        });
    } catch (error) {
        console.error('Error fetching doctor stats:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch doctor statistics',
            error: error.message
        });
    }
};

module.exports = {
    createDoctor,
    getAllDoctors,
    getDoctorById,
    updateDoctor,
    deleteDoctor,
    updateDoctorStatus,
    updateDoctorRating,
    getDoctorsByDepartment,
    getDoctorStats
};
