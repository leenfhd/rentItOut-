const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentals'); // Adjust the path as necessary

// Register a new rental
router.post('/registerRental', rentalController.registerRental);
router.get('/getAllRentals', rentalController.getAllRentals);
router.get('/getById/:id', rentalController.getRentalById);
router.get('/getByUserId/:id', rentalController.getRentalsByUser);
module.exports = router;