const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/userAuth");
const router = express.Router();

// Public routes
router.post("/signup", authController.signup); // Change to POST
router.post("/login", authController.login); // Change to POST if necessary
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

// Apply login confirmation middleware to protected routes
router.use(authController.loginConfirmation);

// Protected routes
router.get("/profile", userController.getProfile, userController.getUser);
router.get("/search", userController.search);
router.patch("/profile", userController.getProfile, userController.updateUserProfile);
router.delete("/profile", userController.getProfile, userController.deleteProfile);

// Admin-specific middleware for routes that require admin access
router.use(authController.allow("You must be an admin to perform this.", "admin"));

// Admin routes
router.get("/", userController.getAll);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
