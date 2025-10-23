const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController'); // Import the controller

// Route for admin login
router.post('/admin/login', adminController.postAdmin);

// Route to get admin by username or email
// router.get('/admin/getUserDetail/:identifier', adminController.getAdmin);
router.get('/admin/getAllBookings', adminController.getAllBookings);
router.post('/admin/assignMechanic/:bookingId', adminController.assignMechanic);


module.exports = router;