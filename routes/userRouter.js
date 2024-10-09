const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/userAuth");
const router = express.Router();

router.get("/signup", authController.signup);
router.get("/login", authController.login);

router.use(authController.loginConfirmation);
router.get("/profile", userController.getProfile, userController.getUser);
router.get("/search", userController.search);

module.exports = router;
