const { request } = require('express');
// const Message = require('../models/messageSchema.js');
// const User =require('../models/userSchema.js');
const ErrorResponse = require('../utils/errorResponse.js');
const bcrypt = require('bcrypt');
var dt=require('../date.js');
const multer = require("multer");
// const session = require('express-session');
const Message=require('../models/messageSchema.js');

const jwt = require('jsonwebtoken');
const connection = require('../db_connections/dbConnect.js');


// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });




exports.viewUserOFItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    // Call the model function to fetch user data
    const result = await Message.getUserDetailsOfItem(id);

    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      res.status(404).json({ message: "No user data found for the given rental ID" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};



exports.saveMsg = [upload.single("imageFile"), async (req, res, next) => {
  try {
    const result = await Message.createMSG(req, req.body);

    if (result && result.affectedRows > 0) {
      res.status(200).json({ message: "Message sent successfully" });
    } else {
      res.status(404).json({ message: "Message sending failed" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}];
 

exports.userDetailsChat = async (req, res, next) => {
  try {
    const { userId } = req.params;

    // Call the model function to get the user details
    const user = await Message.getUserDetails(userId);

    if (user) {
      res.status(200).json(user);
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};



//function to create a token for the user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

 
exports.fetchMsg = async (req, res, next) => {
  try {
    const { senderId, recepientId } = req.params;

    // Call the model function to fetch messages
    const messages = await Message.getMessages(senderId, recepientId);

    if (messages.length > 0) {
      res.status(200).json(messages);
    } else {
      res.status(404).json({ error: "No messages found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.viewAdmin = async (req, res, next) => {
  try {
    // Call the model function to fetch admins
    const admins = await Message.getAdmins();

    res.status(200).json({
      success: true,
      admins, // returning the result as "admins"
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};


 
exports.viewAllUser = async (req, res, next) => {
  try {
    // Call the model function to fetch all users
    const users = await Message.getAllUsers();

    if (users.length > 0) {
      res.status(200).json(users); // Send the user list
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}; 



exports.deleteMessages = async (req, res, next) => {
  try {
    const { message_id } = req.body;

    // Call the model function to delete the message
    const result = await Message.deleteMessage(message_id);

    // Check the result and respond accordingly
    if (result.affectedRows > 0) {
      res.json({ message: "Message deleted successfully", affectedRows: result.affectedRows });
    } else {
      res.status(404).json({ message: "Message not found" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

 
 