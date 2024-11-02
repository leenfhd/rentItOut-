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


  router.post("/newUserReview", addUserReview);
  router.post("/newRentalReview", addRentalReview);
  router.get("/RentalReview/:rental_id", viewRentalReview);
  router.get("/UserReviews/:Userid", viewUserReviews);
  router.put("/Info/:review_id/:reviewer_id", editReview );
  router.delete("/Review/:review_id", deleteReviews);
  router.get("/data/:name", searchReview);

//for coupon
  router.get('/send-coupon/:user_id', checkAndSendCoupon);

  router.put('/update-user-ratings', updateUserRatings);
 




module.exports = router;