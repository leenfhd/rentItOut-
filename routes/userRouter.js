const express = require("express");
const userController = require("./../controllers/userController");
const authController = require("./../controllers/userAuth");
const router = express.Router();

router.get("/signup", authController.signup);
router.get("/login", authController.login);
router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.use(authController.loginConfirmation);
router.get("/profile", userController.getProfile, userController.getUser);
router.get("/search", userController.search);
router.patch(
  "/profile",
  userController.getProfile,
  userController.updateUserProfile
);
router.delete(
  "/profile",
  userController.getProfile,
  userController.deleteProfile
);

router.use(
  authController.allow("You must be an admin to perform this.", "admin")
);
router.get("/", userController.getAll);
router.get("/:id", userController.getUser);
router.patch("/:id", userController.updateUser);
router.delete("/:id", userController.deleteUser);

module.exports = router;
