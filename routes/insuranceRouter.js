const express = require("express");
const router = express.Router();
insuranceController = require("./../controllers/insuranceController");
authController = require("./../controllers/userAuth");
// router.use(authController.loginConfirmation);
// router.use(
//   authController.allow("You must be renter to perform this.", "renter")
// );

router.post("/", insuranceController.insertInsurance);
router.get("/search", insuranceController.searchInsurance);
router.patch("/:id", insuranceController.updateInsurance);
router.delete("/:id", insuranceController.deleteInsurance);
module.exports = router;
