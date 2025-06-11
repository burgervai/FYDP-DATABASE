const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const appointmentController = require('../controllers/appointmentController');

// Patient routes
router.post('/', 
  authenticate, 
  authorize(['patient']), 
  appointmentController.bookAppointment
);

router.get('/my-appointments', 
  authenticate, 
  authorize(['patient']), 
  appointmentController.getPatientAppointments
);

// Doctor routes
router.get('/doctor', 
  authenticate, 
  authorize(['doctor']), 
  appointmentController.getDoctorAppointments
);

module.exports = router;
