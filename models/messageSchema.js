const bcrypt = require("bcrypt");
const connection = require("../db_connections/dbConnect");
const Message = {
  // Method to create a new user
  createMSG(req, {
    sender_id,
    receiver_id,
    rental_id,
    messageType,
    content
  }) {
    return new Promise((resolve, reject) => {
      const timestamp = new Date();
      const imageUrl = (messageType === "image" && req.file) ? req.file.path : null;
      const message_id = Math.floor(Math.random() * 1000000); // Generate a random ID

      const sql = `
        INSERT INTO Message (message_id, sender_id, receiver_id, rental_id, content, created_at, messageType, imageURL)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `;

      const values = [
        message_id,
        sender_id || null,
        receiver_id || null,
        rental_id || null,
        content || null,
        timestamp,
        messageType,
        imageUrl || null
      ];

      connection.query(sql, values, (err, result) => {
        if (err) {
          console.error("Error executing query:", err);
          return reject(err);
        }

        // Resolve with the result of the query
        resolve(result);
      });
    });
   
   
  },

  getUserDetailsOfItem(id) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT first_name, last_name, email, phone_number, address, rating, start_date, end_date, late_fee, status_rental, total_price
        FROM Users u 
        JOIN Rentals r ON u.user_id = r.owner_id 
        WHERE r.rental_id = ?;
      `;

      connection.query(query, [id], (err, result) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err); 
        }

        resolve(result); 
      });
    });
  },

  getUserDetails(userId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Users WHERE user_id = ?`; // Use parameterized query to avoid SQL injection

      connection.query(query, [userId], (err, result) => {
        if (err) {
          console.error('Database query error:', err);
          return reject(err); // Reject the promise on error
        }

        if (result.length > 0) {
          resolve(result[0]); // Resolve with the user data
        } else {
          resolve(null); // No user found
        }
      });
    });
  },




  getMessages(senderId, recepientId) {
    return new Promise((resolve, reject) => {
      const query = `
        SELECT m.*, u.first_name AS sender_name
        FROM Message m
        JOIN Users u ON m.sender_id = u.user_id
        WHERE (m.sender_id = ? AND m.receiver_id = ?)
           OR (m.sender_id = ? AND m.receiver_id = ?)
        ORDER BY m.created_at ASC
      `;

      connection.query(
        query, 
        [senderId, recepientId, recepientId, senderId], 
        (err, messages) => {
          if (err) {
            console.error("Database query error:", err);
            return reject(err); // Reject the promise on error
          }

          resolve(messages); // Resolve the promise with the messages data
        }
      );
    });
  },

  getAdmins() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Users WHERE User_role = 'admin'`;

      connection.query(query, (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return reject(err); // Reject the promise on error
        }

        resolve(result); // Resolve the promise with the result
      });
    });
  },


  getAllUsers() {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM Users`;

      connection.query(query, (err, result) => {
        if (err) {
          console.error("Database query error:", err);
          return reject(err); // Reject the promise on error
        }

        resolve(result); // Resolve the promise with the result
      });
    });
  },


  deleteMessage: (message_id) => {
    return new Promise((resolve, reject) => {
      const query = `DELETE FROM Message WHERE message_id = ?`;
      connection.query(query, [message_id], (err, result) => {
        if (err) {
          console.error("Error executing delete query:", err);
          return reject(err);
        }
        resolve(result);
      });
    });
  },



};
module.exports = Message;