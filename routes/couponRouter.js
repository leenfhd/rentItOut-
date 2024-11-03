const express = require("express");
const couponController = require("../controllers/couponController");

const router = express.Router();


router.post("/", couponController.createCoupon);


router.get("/", couponController.getAllCoupons);


router.get("/:id", couponController.getCouponById);


router.patch("/:id", couponController.updateCoupon);


router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
