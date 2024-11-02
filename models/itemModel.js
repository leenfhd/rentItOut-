const connection = require("../db_connections/dbConnect");

const Item = {
  // Create a new item with image data
  create({ name, description, price_per_day, availability_status, category_id, owner_id, image_url, image_data }) {
    const sql = `
      INSERT INTO Item (name, description, price_per_day, availability_status, category_id, owner_id, image_url, image_data, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    const values = [name, description, price_per_day, availability_status, category_id, owner_id, image_url, image_data];

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId); // Return the newly created item ID
      });
    });
  },

  // Find item by ID
  findById(itemId) {
    const sql = "SELECT * FROM Item WHERE item_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [itemId], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0]); // Return the item
      });
    });
  },

  // Update item by ID, including image_url or image_data
  updateById(itemId, data) {
    const sql = "UPDATE Item SET ? WHERE item_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [data, itemId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Delete item by ID
  deleteById(itemId) {
    const sql = "DELETE FROM Item WHERE item_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [itemId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get all items
  getAll() {
    const sql = "SELECT * FROM Item";
    return new Promise((resolve, reject) => {
      connection.query(sql, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Search items with filters
  search({ name, category_id, minPrice, maxPrice, availability }) {
    let sql = `SELECT * FROM Item WHERE 1=1`; // 1=1 is a simple way to start a dynamic query

    const values = [];

    // Add conditions based on the presence of query parameters
    if (name) {
      sql += ` AND name LIKE ?`;
      values.push(`%${name}%`); // % for partial matches
    }

    if (category_id) {
      sql += ` AND category_id = ?`;
      values.push(category_id);
    }

    if (minPrice) {
      sql += ` AND price_per_day >= ?`;
      values.push(minPrice);
    }

    if (maxPrice) {
      sql += ` AND price_per_day <= ?`;
      values.push(maxPrice);
    }

    if (availability) {
      sql += ` AND availability_status = ?`;
      values.push(availability);
    }

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  }
};

module.exports = Item;
