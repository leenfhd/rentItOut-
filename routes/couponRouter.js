const express = require("express");
const couponController = require("../controllers/couponController");

const router = express.Router();

// Create a coupon
router.post("/", couponController.createCoupon);

// Get all coupons
router.get("/", couponController.getAllCoupons);

// Get a specific coupon by ID
router.get("/:id", couponController.getCouponById);

// Update a coupon by ID
router.patch("/:id", couponController.updateCoupon);

// Delete a coupon by ID
router.delete("/:id", couponController.deleteCoupon);

module.exports = router;
