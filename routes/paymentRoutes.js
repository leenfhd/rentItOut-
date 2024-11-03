// routes/paymentRoutes.js

const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();


router.post("/payment-intent", paymentController.createPaymentIntent);

module.exports = router;
