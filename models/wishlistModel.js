const connection = require("../db_connections/dbConnect");

const Wishlist = {

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
