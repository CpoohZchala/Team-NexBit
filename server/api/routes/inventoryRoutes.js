const express = require('express');
const router = express.Router();
const inventoryController = require('../controllers/inventoryController');

// Define routes for inventory management
router.post('/inventory/create', inventoryController.createInventoryItem);
router.get('/inventory', inventoryController.getAllInventoryParts);
router.put('/inventory/partcode/:partCode', inventoryController.updateInventoryByPartCode); // Update route by part code
router.delete('/inventory/:id', inventoryController.deleteInventoryItem); // Delete route
router.get('/inventory/partcode/:partCode', inventoryController.getInventoryByPartCode); // Route to fetch by part code
router.put('/inventory/:id', inventoryController.updateInventoryItem); // Update route

module.exports = router;