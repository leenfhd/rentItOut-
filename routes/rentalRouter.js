const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController"); // Adjust the path as necessary

// Register a new rental
router.post("/Rentals", rentalController.registerRental);
router.get("/AllRentals", rentalController.getAllRentals);
router.get("/Rentals", rentalController.getRentals);
router.get("/LateRentals", rentalController.getLateRentals);
router.post("/Fees", rentalController.updateLateFeesController);
router.delete("/:id", rentalController.deleteRental);
router.put("/:id", rentalController.updateRental);
router.post('/decision', rentalController.acceptOrDenyRental);

module.exports = router;
