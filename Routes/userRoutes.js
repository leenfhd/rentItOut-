const express = require('express');
const router = express.Router();
// const { signup, signin, logout, userProfile } = require('../controllers/authController');
// const { isAuthenticated } = require('../controllers/userController.js');
// const User = require('../models/userSchema.js');
// const {SearchUser,checkCode ,signup ,signin,viewUserEmail, logout,viewUser,editProfile,viewUserId}= require('../controllers/userController.js');
const {signup}= require('../controllers/userController.js');
 


//auth routes
// /api/signup
router.post('/signup', signup);
// // /api/signin
// router.post('/signin', signin);
// // // /api/logout
//  router.get('/logout', logout);
 
//  // // /api/viewUser
//  router.get('/viewUser', viewUser);

//  // // /api/viewUser
//  router.post('/viewUserId',viewUserId);

//  // // /api/editProfile
//  router.put('/editProfile/:id', editProfile);

//   // // /api/viewUserEmail
//   router.post('/viewUserEmail',viewUserEmail);
// // // /api/me
// // router.post('/me', isAuthenticated, userProfile);

// // // /api/Search
// router.get('/SearchUser/:key', SearchUser);
// router.post('/checkCode', checkCode);

 

module.exports = router;