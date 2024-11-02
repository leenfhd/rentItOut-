// controllers/paymentController.js

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY); // Use your secret key from environment variables

// Function to create a payment intent
exports.createPaymentIntent = async (req, res) => {
    try {
        const { amount, currency } = req.body; // Expecting amount and currency in the request body

        // Create a payment intent with the amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            payment_method_types: ['card'], // Adjust this based on your needs
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error("Error creating payment intent:", error);
        res.status(500).json({ error: "Error creating payment intent" });
    }
};
