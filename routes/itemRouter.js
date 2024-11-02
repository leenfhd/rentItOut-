const express = require("express");
const itemController = require("../controllers/itemController");
const router = express.Router();

// Routes for items
router
  .route("/")
  .get(itemController.getAll)
  .post(itemController.createOne);  // POST with image upload

router.get("/search", itemController.searchItems);
router.get("/recommendations/:userId", itemController.getRecommendedItems);


router
  .route("/:id")
  .get(itemController.getOne)
  .patch(itemController.updateOne)  // PATCH with image upload
  .delete(itemController.deleteOne);
  router.get('/owner/:ownerId', itemController.getItemsByOwner);


module.exports = router;
