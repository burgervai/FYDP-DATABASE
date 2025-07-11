const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const bedController = require('../controllers/bedController');

// Staff routes
router.get('/',
  authenticate,
  authorize(['doctor', 'admin', 'nurse']),
  bedController.getAllBeds
);

// Admin/Staff routes
router.post('/allocate',
  authenticate,
  authorize(['admin', 'nurse']),
  bedController.allocateBed
);

router.post('/release',
  authenticate,
  authorize(['admin', 'nurse']),
  bedController.releaseBed
);

// Get bed by ID (doctor/admin/nurse)
router.get('/:id',
  authenticate,
  authorize(['doctor', 'admin', 'nurse']),
  bedController.getBedById
);

// Create bed (admin only)
router.post('/',
  authenticate,
  authorize(['admin']),
  bedController.createBed
);

// Update bed (admin only)
router.put('/:id',
  authenticate,
  authorize(['admin']),
  bedController.updateBed
);

// Delete bed (admin only)
router.delete('/:id',
  authenticate,
  authorize(['admin']),
  bedController.deleteBed
);

module.exports = router;
