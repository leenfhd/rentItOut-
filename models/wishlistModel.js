const connection = require("../db_connections/dbConnect");

const Wishlist = {
  // Add an item to the wishlist
  add({ user_id, item_id }) {
    const sql = `
      INSERT INTO wishlists (user_id, item_id, created_at)
      VALUES (?, ?, NOW())
    `;
    const values = [user_id, item_id];

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId); // Return the newly created wishlist ID
      });
    });
  },

  // Get all items in a user's wishlist
  getByUserId(user_id) {
    const sql = `
      SELECT * FROM wishlists WHERE user_id = ?
    `;
    return new Promise((resolve, reject) => {
      connection.query(sql, [user_id], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the user's wishlist items
      });
    });
  },

  // Remove an item from the wishlist
  remove(wishlist_id) {
    const sql = `
      DELETE FROM wishlists WHERE wishlist_id = ?
    `;
    return new Promise((resolve, reject) => {
      connection.query(sql, [wishlist_id], (err, results) => {
        if (err) return reject(err);
        resolve(results); // Return the result of the deletion
      });
    });
  },
};

module.exports = Wishlist;
