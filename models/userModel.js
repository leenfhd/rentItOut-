const bcrypt = require("bcrypt");
const connection = require("../db_connections/dbConnect");
const User = {
  // Method to create a new user
  async create({
    first_name,
    last_name,
    email,
    password,
    phone_number,
    address,
    rating,
    role,
  }) {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);

    const sql = `
        INSERT INTO users (first_name, last_name, email, password, phone_number, address , rating , role, created_at)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
      `;
    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      address,
      rating,
      role,
    ];

    // Return a promise for database insertion
    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId); // Return the ID of the newly created user
      });
    });
  },

  findByEmailandPassword(email, password) {
    const sql = "SELECT * FROM users WHERE email = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [email], async (err, results) => {
        if (err) {
          console.log(err);
          return reject(err); // Reject the promise if there's an error
        }

        if (results.length === 0) {
          return resolve(null); // If no user is found, return null
        }

        const user = results[0];

        // Compare the plain password with the hashed password stored in the DB
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
          return resolve(null); // Password is incorrect, return null
        }

        resolve(user); // Return the user if the password matches
      });
    });
  },

  findById(userId) {
    const sql = "SELECT * FROM users WHERE user_id = ?";

    return new Promise((resolve, reject) => {
      connection.query(sql, [userId], (err, results) => {
        if (err) {
          console.log(err);
          return reject(err); // Reject the promise if there's an error
        }

        if (results.length === 0) {
          return resolve(null); // If no user is found, return null
        }

        const user = results[0];
        resolve(user); // Return the found user
      });
    });
  },
};

module.exports = User;
