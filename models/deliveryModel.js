const bcrypt = require("bcrypt");
const connection = require("../db_connections/dbConnect");

const Delivery = {
  // Method to create a new delivery
  async create({
    rental_id,
    user_id,
    delivery_type,
    pickup_address,
    delivery_address,
    status,
  }) {
    const sql = `
          INSERT INTO delivery (rental_id, user_id, delivery_type, pickup_address, delivery_address, status, created_at)
          VALUES (?, ?, ?, ?, ?, ?, NOW())
        `;
    const values = [
      rental_id,
      user_id,
      delivery_type,
      pickup_address,
      delivery_address,
      status,
    ];

    // Return a promise for database insertion
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId); // Return the ID of the newly created delivery
      });
    });
  },

  findById(deliveryId) {
    const sql = "SELECT * FROM delivery WHERE delivery_id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [userId], (err, results) => {
        if (err) {
          return reject(err); // Reject the promise if there's an error
        }

        if (results.length === 0) {
          return resolve(null); // If no user is found, return null
        }

        const delivery = results[0];
        resolve(delivery); // Return the found delivery
      });
    });
  },
};

module.exports = Delivery;
