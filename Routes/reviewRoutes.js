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





  router.post("/addUserReview", addUserReview);
  router.post("/addRentalReview", addRentalReview);
  router.get("/viewRentalReview/:rental_id", viewRentalReview);
  router.get("/viewUserReviews/:Userid", viewUserReviews);
  router.put("/editReview/:review_id", editReview );
  // router.put('/editRentalReviews', editRentalReviews);
  router.post("/deleteReview/:review_id", deleteReviews);
  router.get("/searchReview/:name", searchReview);



 




module.exports = router;