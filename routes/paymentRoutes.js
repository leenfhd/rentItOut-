// routes/paymentRoutes.js

const express = require("express");
const paymentController = require("../controllers/paymentController");
const router = express.Router();

// Define the route for creating a payment intent
router.post("/payment-intent", paymentController.createPaymentIntent);

module.exports = router;
