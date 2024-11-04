const express = require('express');
const router = express.Router();
 
// const reviewController = require('../controllers/reviewController'); // Adjust path if necessary
// router.get('/rental/:rental_id/reviews', reviewController.viewRentalReview);

const {
  addUserReview,
  addRentalReview,
  viewRentalReview,
  viewUserReviews,
  editReview ,
  deleteReviews,
  searchReview,
  checkAndSendCoupon,
  updateUserRatings 
}= require('../controllers/reviewController');



  router.get("/Rental/:rental_id", viewRentalReview);
  router.get("/User/:Userid", viewUserReviews);
  router.post("/user", addUserReview);
  router.post("/rental", addRentalReview);
  router.delete("/:review_id", deleteReviews);
  router.put("/:review_id/:reviewer_id", editReview );
  
  router.get("/data/:name", searchReview);

  router.get('/send-coupon/:user_id', checkAndSendCoupon);

  router.put('/update-user-ratings', updateUserRatings);
 




module.exports = router;
