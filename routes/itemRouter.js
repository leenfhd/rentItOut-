const express = require("express");
const itemController = require("../controllers/itemController");
const router = express.Router();

// Routes for items
router
.route("/")
.get(itemController.getAll)  // No parameters
.post(itemController.createOne); // No parameters
router.get("/search", itemController.searchItems);
router
.route("/:id")
.get(itemController.getOne) // No parameters
.patch(itemController.updateOne) // No parameters
.delete(itemController.deleteOne); // No parameters


module.exports = router;
