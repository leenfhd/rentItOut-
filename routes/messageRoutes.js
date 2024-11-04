const express = require('express');
const router = express.Router();
const Message = require('../models/messageSchema');
 
const {
  viewUserOFItem ,
  saveMsg,
  userDetailsChat,
  fetchMsg,
  deleteMessages,
  viewAllUser
}= require('../controllers/messageController');



router.post('/user/:itemId', viewUserOFItem);
router.post("/newMessage", saveMsg);
router.get('/AllUser', viewAllUser);
router.get("/userDetails/:userId", userDetailsChat);
router.get("/:senderId/:recepientId", fetchMsg);
router.delete("/:message_id", deleteMessages);



module.exports = router;