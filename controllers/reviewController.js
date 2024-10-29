const { request } = require("express");
const Message = require("../models/messageSchema.js");

const bcrypt = require("bcrypt");

const multer = require("multer");
const Review = require("../models/reviewSchema.js");
const jwt = require("jsonwebtoken");
const connection = require("../db_connections/dbConnect.js");

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});
const upload = multer({ storage: storage });

exports.viewUserOFItem = async (req, res, next) => {
  try {
    const { id } = req.params;

    const result = await Message.getUserDetailsOfItem(id);

    if (result && result.length > 0) {
      res.status(200).json(result);
    } else {
      res
        .status(404)
        .json({ message: "No user data found for the given rental ID" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

exports.addUserReview = async (req, res, next) => {
  try {
    const { rental_id, reviewer_id, reviewer_user_id, rating, comment } =
      req.body;

    if (!rental_id || !reviewer_id || !reviewer_user_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    const result = await Review.addUserReview({
      rental_id,
      reviewer_id,
      reviewer_user_id,
      rating,
      comment,
    });

    res.status(200).json({
      message: "Review added successfully",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding user review:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

exports.addRentalReview = async (req, res, next) => {
  try {
    const { rental_id, reviewer_id, rating, comment } = req.body;
    if (!rental_id || !reviewer_id || !rating) {
      return res.status(400).json({ error: "Missing required fields" });
    }
    const result = await Review.addRentalReview({
      rental_id,
      reviewer_id,
      rating,
      comment,
    });

    res.status(200).json({
      message: "Rental review added successfully",
      reviewId: result.insertId,
    });
  } catch (error) {
    console.error("Error adding rental review:", error);
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
};

exports.viewRentalReview = async (req, res, next) => {
  try {
    const { rental_id } = req.params;

    const reviews = await Review.getReviewsByRental(rental_id);

    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json({ error: "No reviews found for this rental" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.viewUserReviews = async (req, res, next) => {
  try {
    const { Userid } = req.params;
    console.log("user_id", Userid);
    const reviews = await Review.getReviewsByUser(Userid);

    if (reviews.length > 0) {
      res.status(200).json(reviews);
    } else {
      res.status(404).json({ error: "No reviews found for this user" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

exports.editReview = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { rental_id, reviewer_id, reviewer_user_id, rating, comment } =
      req.body;

    const result = await Review.editReview({
      review_id,
      rental_id,
      reviewer_id,
      reviewer_user_id,
      rating,
      comment,
    });
    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.deleteReviews = async (req, res, next) => {
  try {
    const { review_id } = req.params;

    console.log(review_id);

    const result = await Review.deleteReview(review_id);
    res.status(200).json(result);
  } catch (error) {
    console.error("Error deleting review:", error);
    res.status(400).json({ error: error.message });
  }
};

exports.searchReview = async (req, res, next) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: "Name parameter is required" });
    }
    const reviews = await Review.searchName(name);

    if (reviews.length === 0) {
      return res
        .status(404)
        .json({ message: "No reviews found for the given name" });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error searching for reviews by name:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
