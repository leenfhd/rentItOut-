// routes/cartRoutes.js

const express = require('express');
const CartController = require('../controllers/cartController');

const router = express.Router();

// Route to add item to cart
router.post('/', CartController.addItemToCart);

// Route to get cart items for a user
router.get('/:userId', CartController.getCartItems);

// Route to remove item from cart
router.delete('/:id', CartController.removeItemFromCart);

module.exports = router;
