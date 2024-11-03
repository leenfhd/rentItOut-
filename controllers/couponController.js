const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const Coupon = require("../models/couponModel");


exports.createCoupon = catchAsync(async (req, res, next) => {
  const { code, discount_percent, valid_from, valid_until } = req.body;

  const newCouponId = await Coupon.createCoupon({
    code,
    discount_percent,
    valid_from,
    valid_until,
  });

  res.status(201).json({
    status: "success",
    data: {
      coupon_id: newCouponId,
    },
  });
});


exports.getAllCoupons = catchAsync(async (req, res, next) => {
  const coupons = await Coupon.getAllCoupons();

  res.status(200).json({
    status: "success",
    results: coupons.length,
    data: {
      coupons,
    },
  });
});


exports.getCouponById = catchAsync(async (req, res, next) => {
  const coupon = await Coupon.getCouponById(req.params.id);

  if (!coupon) {
    return next(new AppError("Coupon not found", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      coupon,
    },
  });
});


exports.updateCoupon = catchAsync(async (req, res, next) => {
  const updatedCoupon = await Coupon.updateCoupon(req.params.id, req.body);

  res.status(200).json({
    status: "success",
    message: "Coupon updated successfully",
  });
});


exports.deleteCoupon = catchAsync(async (req, res, next) => {
  await Coupon.deleteCoupon(req.params.id);

  res.status(204).json({
    status: "success",
    message: "Coupon deleted successfully",
  });
});
