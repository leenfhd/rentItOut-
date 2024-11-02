const connection = require("../db_connections/dbConnect");

const Coupon = {
  // Create a new coupon
  createCoupon(couponData) {
    const { code, discount_percent, valid_from, valid_until } = couponData;
    const sql = `
      INSERT INTO coupons (code, discount_percent, valid_from, valid_until)
      VALUES (?, ?, ?, ?)
    `;
    const values = [code, discount_percent, valid_from, valid_until];

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results.insertId);
      });
    });
  },

  // Retrieve all coupons
  getAllCoupons() {
    return new Promise((resolve, reject) => {
      connection.query("SELECT * FROM coupons", (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Get a coupon by ID
  getCouponById(couponId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "SELECT * FROM coupons WHERE coupon_id = ?",
        [couponId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results[0]);
        }
      );
    });
  },

  // Update a coupon
  updateCoupon(couponId, updatedData) {
    const { code, discount_percent, valid_from, valid_until } = updatedData;
    const sql = `
      UPDATE coupons
      SET code = ?, discount_percent = ?, valid_from = ?, valid_until = ?
      WHERE coupon_id = ?
    `;
    const values = [code, discount_percent, valid_from, valid_until, couponId];

    return new Promise((resolve, reject) => {
      connection.query(sql, values, (err, results) => {
        if (err) return reject(err);
        resolve(results);
      });
    });
  },

  // Delete a coupon
  deleteCoupon(couponId) {
    return new Promise((resolve, reject) => {
      connection.query(
        "DELETE FROM coupons WHERE coupon_id = ?",
        [couponId],
        (err, results) => {
          if (err) return reject(err);
          resolve(results);
        }
      );
    });
  },
};

module.exports = Coupon;
