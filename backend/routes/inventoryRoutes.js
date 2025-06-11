const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

// View inventory (staff only)
router.get('/',
  authenticate,
  authorize(['admin', 'pharmacist', 'nurse']),
  inventoryController.getInventory
);

// Add/update inventory items (admin/pharmacist only)
router.post('/',
  authenticate,
  authorize(['admin', 'pharmacist']),
  inventoryController.upsertInventoryItem
);

module.exports = router;
