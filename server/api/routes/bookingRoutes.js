const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingController');

// Route for creating a new booking
router.post('/booking', bookingController.createBooking);

// Route for getting user details
router.get('/user/:userEmail', bookingController.getUserDetails);
router.get('/booking/:bookingId', bookingController.getBooking);
router.get('/bookingById/:bookingId', bookingController.bookingById);
router.get('/bookingForMechanic/:userId', bookingController.bookingForMechanic);
router.post('/acceptBooking/:bookingId', bookingController.acceptBooking);
router.post('/rejectBooking/:bookingId', bookingController.rejectBooking);
router.post('/completeBooking/:bookingId', bookingController.completeBooking);
router.get('/bookingCount/getAllBookings', bookingController.getAllBookings);
router.get('/getAllBookings/:userId', bookingController.getAllBookingsByUserId);
router.get('/changePaymentStatus/:bookingId', bookingController.changePaymentStatus);


router.post('/addBill/:bookingId', bookingController.addBill);

module.exports = router;