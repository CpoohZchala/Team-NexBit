const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');    


router.get('/notification/getNotification/:userId',notificationController.getNotification);
router.get('/notification/getNotificationForMechanic/:userId',notificationController.getNotificationForMechanic);
router.post('/notification/createNotification/:userId',notificationController.createNotification);

module.exports = router;