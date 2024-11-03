const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController'); // Adjust the path as necessary
router.post('/Notifications', notificationController.createNotification);
router.get('/Notifications/:id', notificationController.getUserNotifications);
router.put('/markAsRead/:id', notificationController.markAsRead);
router.delete('/Notifications/:id', notificationController.deleteNotification);
module.exports = router;