const bcrypt = require("bcrypt");
const axios = require("axios");
const connection = require("../db_connections/dbConnect");
require("dotenv").config();
const apiKey = process.env.IPINFO_API_KEY;
const User = {
  async create({ first_name, last_name, email, password, phone_number, role }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    // Fetch location data from ipinfo.io API
    let address;
    let rating = "1";
    try {
      const response = await axios.get("https://ipinfo.io/json", {
        headers: {
          Authorization: `Bearer ${apiKey}`, // Replace YOUR_API_KEY with your ipinfo.io API key
        },
      });
      const { city, region, country } = response.data; // Extract location details
      address = `${city}, ${region}, ${country}`; // Format the address as needed
    } catch (error) {
      console.error("Error fetching location data:", error);
      address = "Unknown"; // Set a default if location fetch fails
    }

    const sql = `
      INSERT INTO users (first_name, last_name, email, password, phone_number, address, rating, role, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [
      first_name,
      last_name,
      email,
      hashedPassword,
      phone_number,
      address, // Use location data as the address
      rating,
      role,
    ];

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        resolve(results.insertId);
      });
    });
  },

  async findByEmailandPassword(email, password) {
    const sql = "SELECT * FROM users WHERE email = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [email], async (err, results) => {
        if (err) {
          return reject(err);
        }

        if (results.length === 0) {
          return reject(new Error("User not found"));
        }

        const user = results[0];
        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
          return reject(new Error("Incorrect password"));
        }

        resolve(user);
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
