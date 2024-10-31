const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController"); // Adjust the path as necessary

// Register a new rental
router.post("/Rentals", rentalController.registerRental);
router.post("/addRentals", rentalController.addRental);
router.get("/AllRentals", rentalController.getAllRentals);
router.post("/Fees", rentalController.updateLateFeesController);
router.delete("/:id", rentalController.deleteRental);
router.get("/Rentals", rentalController.getRentals);
router.put("/Rentals/:id", rentalController.updateRental);
router.post('/decision', rentalController.acceptOrDenyRental);
module.exports = router;
