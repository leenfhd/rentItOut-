const connection = require("../db_connections/dbConnect");

const Insurance = {
  create({ rental_id, user_id, description, status }) {
    const sql = `
      INSERT INTO Item (rental_id, user_id, description, status,  created_at)
      VALUES (?, ?, ?, ?, NOW())
    `;
    const values = [rental_id, user_id, description, status];

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  },

  findById(insuranceId) {
    const sql = "SELECT * FROM Insurance WHERE insurance_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [itemId], (err, results) => {
        if (err) return reject(err);
        if (results.length === 0) return resolve(null);
        resolve(results[0]);
      });
    });
  },

  updateById(itemId, data) {
    const sql = "UPDATE Insurance SET ? WHERE insurance_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [data, itemId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  deleteById(itemId) {
    const sql = "DELETE FROM Insurance WHERE insurance_id = ?";
    return new Promise((resolve, reject) => {
      connection.query(sql, [itemId], (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },
};

module.exports = Insurance;
