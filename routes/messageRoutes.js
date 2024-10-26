const express = require("express");
const router = express.Router();
const Message = require("../models/messageSchema");

const {
  viewUserOFItem,
  saveMsg,
  userDetailsChat,
  fetchMsg,
  deleteMessages,
  viewAllUser,
} = require("../controllers/messageController");

//for user ...
// /api/viewUserOFItem renter and rental info       -----Done
router.post("/UserOFItem/:id", viewUserOFItem);

// /api/saveMsg between two users        -----Done
router.post("/newMessage", saveMsg);

// /api/viewAllUser  info       -----Done
router.get("/AllUser", viewAllUser);

// /api/userDetailsChat user who chat with    -----Done
router.get("/userDetailsChat/:userId", userDetailsChat);

// /api/fetchMsg      view all MSGs between the sender and reseiver regardless of the order       -----Done
router.get("/messages/:senderId/:recepientId", fetchMsg);

// /api/deleteMessages acoording mesdage_id     -----Done
router.post("/Messages", deleteMessages);

// /api/viewAdmin
// router.get("/admin", viewAdmin);

module.exports = router;
