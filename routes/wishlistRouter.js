const express = require("express");
const Wishlist = require("../models/wishlistModel");

const router = express.Router();

router.post("/", async (req, res) => {
  const { user_id, item_id } = req.body;
  console.log(`Received request to add item: user_id=${user_id}, item_id=${item_id}`);

  try {
    const wishlistId = await Wishlist.add({ user_id, item_id });
    res.status(201).json({ status: "success", wishlistId });
  } catch (error) {
    console.error('Error adding to wishlist:', error);
    res.status(500).json({ status: "error", message: error.message });
  }
});


router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  try {
    const items = await Wishlist.getByUserId(user_id);
    res.status(200).json({ status: "success", data: items });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});


router.delete("/:wishlist_id", async (req, res) => {
  const { wishlist_id } = req.params;
  try {
    const result = await Wishlist.remove(wishlist_id);
    res.status(200).json({ status: "success", result });
  } catch (error) {
    res.status(500).json({ status: "error", message: error.message });
  }
});

module.exports = router;
