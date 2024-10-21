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
  searchReview
}= require('../controllers/reviewController');





  router.post("/newUserReview", addUserReview);
  router.post("/newRentalReview", addRentalReview);
  router.get("/RentalReview/:rental_id", viewRentalReview);
  router.get("/UserReviews/:Userid", viewUserReviews);
  router.put("/Review/Info/:review_id", editReview );
  // router.put('/editRentalReviews', editRentalReviews);
  router.post("/Review/:review_id", deleteReviews);
  router.get("/Review/data/:name", searchReview);



 




module.exports = router;