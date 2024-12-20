const express = require("express");
const router = express.Router();
delivaryController = require("./../controllers/delivaryController");
authController = require("./../controllers/userAuth");
router.use(authController.loginConfirmation);

router.use(
  authController.allow(
    "You must be owner or renter to perform this.",
    "owner",
    "renter"
  )
);

router.get("/delevares", delivaryController.searchDelivery);
router.patch("/:id", delivaryController.updateDelivery);
router.use(
  authController.allow("You must be renter to perform this.", "renter")
);

router.post("/", delivaryController.insertDelivery);
router.get("/search", delivaryController.searchDelivery);
router.patch("/:id", delivaryController.updateDelivery);
router.delete("/:id", delivaryController.deleteDelivery);

module.exports = router;
