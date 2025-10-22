const express = require('express');
const {
  getHospitals,
  getHospital,
  createHospital,
  updateHospital,
  deleteHospital,
  getHospitalsInRadius
} = require('../controllers/hospitalController');

// Middleware
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

// Public routes
router.route('/')
  .get(getHospitals);

router.route('/radius/:zipcode/:distance')
  .get(getHospitalsInRadius);

router.route('/:id')
  .get(getHospital);

// Protected routes (require authentication and authorization)
router.use(protect);

router.route('/')
  .post(
    authorize('admin'),
    createHospital
  );

router.route('/:id')
  .put(
    authorize('admin'),
    updateHospital
  )
  .delete(
    authorize('admin'),
    deleteHospital
  );

module.exports = router;
