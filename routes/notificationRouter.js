const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController"); // Adjust the path as necessary
router.post("/", notificationController.createNotification);
router.get("/", notificationController.getUserNotifications);
router.put("/markAsRead/:id", notificationController.markAsRead);
router.delete("/:id", notificationController.deleteNotification);
module.exports = router;
