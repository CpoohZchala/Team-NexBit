const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Import the controller

// Route with optional 'id' parameter, calling the controller function
// router.get('/user/:id?', userController.getUser);

// Route for creating a new user
router.post('/bookslot', userController.createBooking);

module.exports = router;