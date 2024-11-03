const bcrypt = require("bcrypt");
const connection = require("../db_connections/dbConnect");
const Review = {




  addUserReview: async ({reviewer_id, reviewer_user_id, rating, comment }) => {
    return new Promise((resolve, reject) => {
        const timestamp = new Date();
        
      
        const checkRentalQuery = `
            SELECT COUNT(*) AS count 
            FROM Rentals 
            WHERE  renter_id = ? AND owner_id = ?
        `;
        
        const checkValues = [reviewer_id, reviewer_user_id]; 

        connection.query(checkRentalQuery, checkValues, (err, results) => {
            if (err) {
                console.error('Database error checking rental:', err);
                return reject(err);
            }

            const count = results[0].count;
            if (count > 0) {
          
                const query = `
                    INSERT INTO Review ( reviewer_id, reviewer_user_id, rating, comment, created_at)
                    VALUES ( ?, ?, ?, ?, ?)
                `;
                const values = [ reviewer_id, reviewer_user_id, rating, comment, timestamp];

                connection.query(query, values, (err, result) => {
                    if (err) {
                        console.error('Database error adding user review:', err); 
                        return reject(err); 
                    }
                    resolve(result); 
                });
            } else {
                reject(new Error('You cannot review this rental because you are not the renter or have not rented from this owner.'));
            }
        });
    });
},



  addRentalReview: ({ rental_id, reviewer_id, rating, comment }) => {
    return new Promise((resolve, reject) => {
        const timestamp = new Date();

      
        const checkRentalQuery = `
            SELECT COUNT(*) AS count 
            FROM Rentals 
            WHERE rental_id = ? AND renter_id = ?
        `;

        connection.query(checkRentalQuery, [rental_id, reviewer_id], (err, results) => {
            if (err) {
                console.error('Database error checking rental:', err);
                return reject(err);
            }

            const count = results[0].count;

            // Step 2: If the count is greater than 0, proceed to add the review
            if (count > 0) {
                const insertQuery = `
                    INSERT INTO Review (rental_id, reviewer_id, rating, comment, created_at)
                    VALUES (?, ?, ?, ?, ?)
                `;
                const values = [rental_id, reviewer_id, rating, comment, timestamp];

                connection.query(insertQuery, values, (err, result) => {
                    if (err) {
                        console.error('Database error adding rental review:', err);
                        return reject(err);
                    }
                    resolve(result);
                });
            } else {
                // Reject if the user has not rented the item
                reject(new Error('You cannot review this rental because you have not rented it.'));
            }
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



  editReview: ({ review_id, reviewer_id, rental_id, reviewer_user_id, rating, comment }) => {
    return new Promise((resolve, reject) => {
        // Step 1: Check if the review belongs to the reviewer
        const checkReviewerQuery = 'SELECT reviewer_id FROM Review WHERE review_id = ?';
        
        connection.query(checkReviewerQuery, [review_id], (err, results) => {
            if (err) {
                console.error("Error checking reviewer for review:", err);
                return reject(new Error("Internal Server Error"));
            }

            if (results.length === 0) {
                return reject(new Error("Review not found."));
            }

            // Check if the reviewer ID matches
            if (results[0].reviewer_id !== parseInt(reviewer_id)) {
                return reject(new Error('Unauthorized'));
            }

            // Step 2: If authorized, proceed with the update
            const timestamp = new Date().toISOString().slice(0, 19).replace('T', ' ');
            const updateQuery = `
                UPDATE Review 
                SET rental_id = ?, reviewer_user_id = ?, rating = ?, comment = ?, created_at = ?
                WHERE review_id = ?
            `;
            const values = [rental_id, reviewer_user_id, rating, comment, timestamp, review_id];

            connection.query(updateQuery, values, (err, result) => {
                if (err) {
                    console.error("Error executing update query:", err);
                    return reject(new Error("Internal Server Error"));
                }

                if (result.affectedRows > 0) {
                    resolve({ message: "Review updated successfully", result });
                } else {
                    reject(new Error("Review not found or no changes made."));
                }
            });
        });
    });
},



deleteReview: (review_id, reviewer_id) => {
  return new Promise((resolve, reject) => {
    // Step 1: Check if the review exists and if the reviewer_id matches
    const checkQuery = `SELECT reviewer_id FROM Review WHERE review_id = ?`;
    
    connection.query(checkQuery, [review_id], (err, results) => {
      if (err) {
        console.error("Error checking review existence:", err);
        return reject({ message: "Internal Server Error", error: err });
      }

      // If no review is found, reject with 'not found' message
      if (results.length === 0) {
        return reject({ message: "Review not found" });
      }

      // Step 2: Verify if the requesting user is the creator of the review
      if (results[0].reviewer_id !== parseInt(reviewer_id)) {
        return reject(new Error("Unauthorized"));
      }

      // Step 3: Proceed to delete the review if the check passes
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




  // Function to get the average rating for a specific user
  getUserAverageRating: (user_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(rating) AS average_rating 
        FROM Review 
        WHERE reviewer_user_id = ?
      `;
      connection.query(query, [user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].average_rating || 0);
      });
    });
  },

  // Function to get the average rating of all rentals owned by a user
  getOwnerAverageRating: (owner_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(rating) AS average_rating 
        FROM Review 
        JOIN Rentals ON Review.rental_id = Rentals.rental_id 
        WHERE Rentals.owner_id = ?
      `;
      connection.query(query, [owner_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].average_rating || 0);
      });
    });
  },

  // Function to fetch a coupon from the Coupons table
  getCoupon: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT code 
        FROM Coupons 
        ORDER BY RAND() 
        LIMIT 1
      `;
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results[0]);
      });
    });
  },

  // Function to send a message
  sendMessage: (sender_email, receiver_id, content) => {
    return new Promise((resolve, reject) => {
      // Step 1: Get sender_id from users table using sender_email
      const getUserIdQuery = `SELECT user_id FROM users WHERE email = ?`;
      connection.query(getUserIdQuery, [sender_email], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) {
          // If no user is found with the provided email
          return reject(new Error('Sender email not found.'));
        }
  
        const sender_id = results[0].user_id; // Retrieve the sender_id from the results
        const timestamp = new Date();
        const message_id = Math.floor(Math.random() * 1000000); // Generate a random ID

        // Step 2: Insert the message into the Message table
        const insertMessageQuery = `
          INSERT INTO Message (message_id,sender_id, receiver_id, content, created_at, messageType) 
          VALUES (?,?, ?, ?, ?, 'text')
        `;
        const values = [message_id,sender_id, receiver_id, content, timestamp];
  
        connection.query(insertMessageQuery, values, (err, result) => {
          if (err) return reject(err);
          resolve(result);
        });
      });
    });
  },


  getUserAverageRating: (user_id) => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT AVG(rating) AS average_rating 
        FROM Review 
        WHERE reviewer_user_id = ?
      `;
      connection.query(query, [user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results[0].average_rating || 0);
      });
    });
  },

 // Function to update the user's average rating in the Users table
  updateUserAverageRating: (user_id, average_rating) => {
    return new Promise((resolve, reject) => {
      const query = `
        UPDATE Users 
        SET rating = ? 
        WHERE user_id = ?
      `;
      const values = [average_rating, user_id];
      connection.query(query, values, (err, result) => {
        if (err) return reject(err);
        resolve(result);
      });
    });
  },

  // Function to get all users
  getAllUsers: () => {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT user_id 
        FROM Users
      `;
      connection.query(query, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }


};
module.exports = Review;