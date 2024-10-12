const bcrypt = require("bcrypt");
const connection = require("../db_connections/dbConnect");
const Review = {



  addUserReview: ({ rental_id, reviewer_id, reviewer_user_id, rating, comment }) => {
    return new Promise((resolve, reject) => {
      const timestamp = new Date();
      const query = `
        INSERT INTO Review (rental_id, reviewer_id, reviewer_user_id, rating, comment, createed_at)
        VALUES (?, ?, ?, ?, ?, ?)
      `;
      const values = [rental_id, reviewer_id, reviewer_user_id, rating, comment, timestamp];

      connection.query(query, values, (err, result) => {
        if (err) {
          console.error('Database error adding user review:', err); 
          return reject(err); 
        }
        resolve(result); 
      });
    });
  },




  addRentalReview: ({ rental_id, reviewer_id, rating, comment }) => {
    return new Promise((resolve, reject) => {
      const timestamp = new Date();
      const query = `
        INSERT INTO Review (rental_id, reviewer_id, rating, comment, createed_at)
        VALUES (?, ?, ?, ?, ?)
      `;
      const values = [rental_id, reviewer_id, rating, comment, timestamp];

      connection.query(query, values, (err, result) => {
        if (err) {
          console.error('Database error adding rental review:', err); 
          return reject(err); 
        }
        resolve(result); 
      });
    });
 
  },




  getReviewsByRental: (rental_id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Review WHERE rental_id = ?`;
      connection.query(query, [rental_id], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },




  getReviewsByUser: (Userid) => {
    console.log(Userid);
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Review WHERE reviewer_user_id = ?`;
      connection.query(query, [Userid], (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },




  editReview: ({ review_id, rental_id, reviewer_id, reviewer_user_id, rating, comment }) => {
    return new Promise((resolve, reject) => {

      const checkRentalQuery = 'SELECT rental_id FROM Rentals WHERE rental_id = ?';
      connection.query(checkRentalQuery, [rental_id], (err, result) => {
        if (err) {
          console.error("Error executing rental check query:", err);
          return reject({ message: "Internal Server Error", error: err });
        }

        if (result.length === 0) {
          return reject({ message: "Rental not found. Invalid rental_id." });
        }


        const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' '); 
            const updateQuery = `
          UPDATE Review 
          SET rental_id = ?, reviewer_id = ?, reviewer_user_id = ?, rating = ?, comment = ?, createed_at = ?
          WHERE review_id = ?
        `;

        const values = [rental_id, reviewer_id, reviewer_user_id, rating, comment, timestamp, review_id];

        connection.query(updateQuery, values, (err, result) => {
          if (err) {
            console.error("Error executing update query:", err);
            return reject({ message: "Internal Server Error", error: err });
          }

    
          if (result.affectedRows > 0) {
            resolve({ message: "Review updated successfully", result });
          } else {
            reject({ message: "Review not found or no changes made" });
          }
        });
      });
    });
  },





  deleteReview: (review_id) => {
    console.log(review_id);

    return new Promise((resolve, reject) => {
  
      const checkQuery = `SELECT * FROM Review WHERE review_id = ?`;
      connection.query(checkQuery, [review_id], (err, results) => {
        if (err) {
          console.error("Error checking review existence:", err);
          return reject({ message: "Internal Server Error", error: err });
        }

        // // If no review found, reject with 'not found' message
        // if (results.length === 0) {
        //   return reject({ message: "Review not found" });
        // }

        // Proceed to delete the review
        const deleteQuery = `DELETE FROM Review WHERE review_id = ?`;

        connection.query(deleteQuery, [review_id], (err, result) => {
          if (err) {
            console.error("Error executing delete query:", err);
            return reject({ message: "Internal Server Error", error: err });
          }

          resolve({ message: "Review deleted successfully", result });
        });
      });
    });
  },






  searchName: (searchTerm) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT r.*, u.first_name, u.last_name
        FROM Review r
        JOIN Users u ON r.reviewer_user_id = u.user_id OR r.reviewer_id = u.user_id
        WHERE u.first_name LIKE ? OR u.last_name LIKE ?
      `;

      const searchValue = `%${searchTerm}%`; 
      const values = [searchValue, searchValue];

      connection.query(query, values, (err, results) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject(err);
        }
        resolve(results);
      });
    });
  },







};
module.exports = Review;