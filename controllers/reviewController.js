const { request } = require('express');
const Message = require('../models/messageSchema.js');
const multer = require("multer");
const Review =require('../models/reviewSchema.js');
 

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



exports.addUserReview = async (req, res, next) => {
  try {
      const {   reviewer_id, reviewer_user_id, rating, comment } = req.body;
     
console.log(  reviewer_id);
console.log(  reviewer_user_id);
console.log(  rating);

console.log(  comment);


      if (  !reviewer_id || !reviewer_user_id || !rating) {
          return res.status(400).json({ error: 'Missing required fields' });
      }

      const result = await Review.addUserReview({ reviewer_id, reviewer_user_id, rating, comment });

      res.status(200).json({ message: 'Review added successfully', reviewId: result.insertId });
  } catch (error) {
      console.error('Error adding user review:', error);
      res.status(500).json({ error: error.message || 'Internal Server Error' });
  }
};


 





exports.addRentalReview = async (req, res, next) => {
  try {
    const { rental_id, reviewer_id, rating, comment } = req.body;

    if (!rental_id || !reviewer_id || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const result = await Review.addRentalReview({ rental_id, reviewer_id, rating, comment });

    res.status(200).json({ message: 'Rental review added successfully', reviewId: result.insertId });
  } catch (error) {
    console.error('Error adding rental review:', error);

    if (error.message === 'You cannot review this rental because you have not rented it.') {
      return res.status(403).json({ error: error.message });
    }
    res.status(500).json({ error: error.message || 'Internal Server Error' });
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
    console.log("user_id",Userid);
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
    // Extract review_id and reviewer_id from URL params
    const { review_id, reviewer_id } = req.params;
    const { rental_id, reviewer_user_id, rating, comment } = req.body;

    // Call editReview method with necessary details
    const result = await Review.editReview({ review_id, reviewer_id, rental_id, reviewer_user_id, rating, comment });

    res.status(200).json(result);
  } catch (error) {
    if (error.message === 'Unauthorized') {
      return res.status(403).json({ error: 'You are not authorized to edit this review.' });
    }
    res.status(400).json({ error: error.message });
  }
};





exports.deleteReviews = async (req, res, next) => {
  try {
    const { review_id } = req.params;
    const { reviewer_id } = req.body; // Assuming `reviewer_id` is sent in the request body

    const result = await Review.deleteReview(review_id, reviewer_id);
    res.status(200).json(result);

  } catch (error) {
    if (error.message === "Unauthorized") {
      return res.status(403).json({ error: "You are not authorized to delete this review." });
    }
    console.error("Error deleting review:", error);
    res.status(400).json({ error: error.message });
  }
};





exports.searchReview = async (req, res, next) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({ message: 'Name parameter is required' });
    }
    const reviews = await Review.searchName(name);

    if (reviews.length === 0) {
      return res.status(404).json({ message: 'No reviews found for the given name' });
    }
    res.status(200).json(reviews);
  } catch (error) {
    console.error('Error searching for reviews by name:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

 
 

exports.checkAndSendCoupon = async (req, res) => {
  const { user_id } = req.params; // Assume user_id is passed in the URL

  try {
    // Step 1: Get the average rating for the user
    const userAverageRating = await Review.getUserAverageRating(user_id);

    if (userAverageRating >= 4) {
      // Step 2: Get the owner's average rating
      const ownerAverageRating = await Review.getOwnerAverageRating(user_id);

      if (ownerAverageRating >= 4) {
        // Step 3: Get a coupon
        const coupon = await Review.getCoupon();

        // Step 4: Send a message
        await Review.sendMessage('rentitout@gmail.com', user_id, `Congratulations! Here is your coupon code: ${coupon.code}`);

        return res.status(200).json({ message: 'Coupon sent successfully!', coupon: coupon.code });
      }
    }

    res.status(400).json({ message: 'Conditions not met for sending a coupon.' });
  } catch (error) {
    console.error('Error checking ratings and sending coupon:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

exports.updateUserRatings = async (req, res) => {
  try {
    // Step 1: Get all users
    const users = await Review.getAllUsers();

    // Step 2: For each user, calculate their average rating and update it
    for (const user of users) {
      const averageRating = await Review.getUserAverageRating(user.user_id);
      await Review.updateUserAverageRating(user.user_id, averageRating);
    }

    res.status(200).json({ message: 'User ratings updated successfully.' });
  } catch (error) {
    console.error('Error updating user ratings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};