const Hospital = require('../models/HospitalModel');
const asyncHandler = require('express-async-handler');

// @desc    Get all hospitals
// @route   GET /api/hospitals
// @access  Public
const getHospitals = asyncHandler(async (req, res) => {
  try {
    const hospitals = await Hospital.find({ isActive: true })
      .select('-__v -createdAt -updatedAt -isActive');
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    console.error('Error fetching hospitals:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Get single hospital
// @route   GET /api/hospitals/:id
// @access  Public
const getHospital = asyncHandler(async (req, res) => {
  try {
    const hospital = await Hospital.findById(req.params.id)
      .select('-__v -createdAt -updatedAt -isActive');
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    console.error(`Error fetching hospital ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// @desc    Create new hospital
// @route   POST /api/hospitals
// @access  Private/Admin
const createHospital = asyncHandler(async (req, res) => {
  try {
    const hospital = await Hospital.create(req.body);
    
    res.status(201).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    console.error('Error creating hospital:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating hospital',
      error: error.message
    });
  }
});

// @desc    Update hospital
// @route   PUT /api/hospitals/:id
// @access  Private/Admin
const updateHospital = asyncHandler(async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: hospital
    });
  } catch (error) {
    console.error(`Error updating hospital ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error updating hospital',
      error: error.message
    });
  }
});

// @desc    Delete hospital
// @route   DELETE /api/hospitals/:id
// @access  Private/Admin
const deleteHospital = asyncHandler(async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    
    if (!hospital) {
      return res.status(404).json({
        success: false,
        message: 'Hospital not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    console.error(`Error deleting hospital ${req.params.id}:`, error);
    res.status(500).json({
      success: false,
      message: 'Error deleting hospital',
      error: error.message
    });
  }
});

// @desc    Get hospitals within a radius (in miles)
// @route   GET /api/hospitals/radius/:zipcode/:distance
// @access  Public
const getHospitalsInRadius = asyncHandler(async (req, res) => {
  try {
    const { zipcode, distance } = req.params;
    
    // TODO: Implement geocoding to get lat/lng from zipcode
    // For now, using a default location
    const loc = {
      type: 'Point',
      coordinates: [-118.113491, 34.111745],
      formattedAddress: '1050 N Lake Ave, Pasadena, CA 91104, USA',
      street: '1050 N Lake Ave',
      city: 'Pasadena',
      state: 'CA',
      zipcode: '91104',
      country: 'USA'
    };
    
    // Calculate radius using radians
    // Divide distance by radius of Earth (3,963 mi / 6,378 km)
    const radius = distance / 3963;
    
    const hospitals = await Hospital.find({
      location: {
        $geoWithin: { $centerSphere: [[loc.coordinates[0], loc.coordinates[1]], radius] }
      },
      isActive: true
    });
    
    res.status(200).json({
      success: true,
      count: hospitals.length,
      data: hospitals
    });
  } catch (error) {
    console.error('Error getting hospitals in radius:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

module.exports = {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitalsInRadius
};
