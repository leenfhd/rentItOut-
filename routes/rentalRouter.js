const express = require("express");
const router = express.Router();
const rentalController = require("../controllers/rentalController"); // Adjust the path as necessary


router.post("/", rentalController.registerRental);//register a new rental
router.get("/AllRentals", rentalController.getAllRentals);//get all rentals for admin
router.get("/", rentalController.getRentals);// search on items by specific field
router.get("/LateRentals", rentalController.getLateRentals);//get late unretrieved rentals
router.put("/Fees", rentalController.updateLateFeesController);// add fees to late rentals
router.delete("/:id", rentalController.deleteRental);//delete rental by admin
router.put("/:id", rentalController.updateRental);//update rental info
router.post("/decision", rentalController.acceptOrDenyRental);//accept or deny renting request by owner

module.exports = router;
