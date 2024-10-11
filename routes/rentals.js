const express = require('express');
const router = express.Router();
const rentalController = require('../controllers/rentals'); // Adjust the path as necessary

// Register a new rental
router.post('/registerRental', rentalController.registerRental);
router.get('/getAllRentals', rentalController.getAllRentals);
router.get('/getById/:id', rentalController.getRentalById);
router.get('/getByUserId/:id', rentalController.getRentalsByUser);
router.get('/getByItem/:id', rentalController.getRentalsByItem);
router.put('/updateStatus/:id', rentalController.updateStatus);
router.put('/updateDates/:id', rentalController.updateDates);
router.put('/updatePrice/:id', rentalController.updatePrice);
router.post('/updateLateFees', rentalController.updateLateFeesController);
router.delete('/deleteRental/:id', rentalController.deleteRental);
module.exports = router;