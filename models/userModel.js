const bcrypt = require("bcrypt");
const axios = require("axios");
const connection = require("../db_connections/dbConnect");
require("dotenv").config();
const apiKey = process.env.IPINFO_API_KEY;
const User = {
  async create({
    first_name,
    last_name,
    email,
    password,
    phone_number,
    rating,
    role,
  }) {
    const hashedPassword = await bcrypt.hash(password, 12);

    // Fetch location data from ipinfo.io API
    let address;
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

  // Other methods remain the same
};

module.exports = User;
