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

module.exports = router;
