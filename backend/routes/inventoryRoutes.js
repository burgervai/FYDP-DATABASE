const express = require('express');
const router = express.Router();
const { authenticate, authorize } = require('../middleware/authMiddleware');
const inventoryController = require('../controllers/inventoryController');

// View all inventory items (admin/doctor/pharmacist/nurse/patient)
router.get('/',
  authenticate,
  authorize(['admin', 'doctor', 'pharmacist', 'nurse', 'patient']),
  inventoryController.getInventory
);

// Add new inventory item (admin/pharmacist)
router.post('/',
  authenticate,
  authorize(['admin', 'pharmacist']),
  inventoryController.upsertInventoryItem
);

// Get inventory item by ID (admin/doctor/pharmacist/nurse)
router.get('/:id',
  authenticate,
  authorize(['admin', 'doctor', 'pharmacist', 'nurse']),
  inventoryController.getInventoryItemById
);

// Update inventory item (admin/pharmacist)
router.put('/:id',
  authenticate,
  authorize(['admin', 'pharmacist']),
  inventoryController.updateInventoryItem
);

// Delete inventory item (admin/pharmacist)
router.delete('/:id',
  authenticate,
  authorize(['admin', 'pharmacist']),
  inventoryController.deleteInventoryItem
);

module.exports = router;
