const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController"); 
router.post("/", notificationController.createNotification);//create specific notification
router.get("/", notificationController.getUserNotifications);//get user notifications
router.put("/markAsRead/:id", notificationController.markAsRead);//mark notification as read
router.delete("/:id", notificationController.deleteNotification);//delete notification
module.exports = router;
