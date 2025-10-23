const express = require('express');
const router = express.Router();
const mechanicController = require('../controllers/mechanicController');

// Route for creating a new mechanic
router.post('/esignup', mechanicController.createMechanic);
router.get('/bookingSlot/getAllMechanics', mechanicController.getAllMechanics);
router.get('/getAllMechanics', mechanicController.getAllMechanicsToAdmin);

// Route for getting mechanic count
router.get('/mechanicCount/getAllMechanics', mechanicController.getAllMechanicsCount);
router.get('/mechanics/:mechanicId', mechanicController.getMechanicById);

module.exports = router;