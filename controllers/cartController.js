// cartController.js

const db = require("../db_connections/dbConnect"); // Import the DB connection
const catchAsync = require("../utils/catchAsync"); // Utility for handling async errors
const AppError = require("../utils/appError"); // Custom error handling

// Add item to cart
// cartController.js

exports.addItemToCart = catchAsync(async (req, res, next) => {
  const { user_id, item_id, quantity } = req.body;

  if (!user_id || !item_id || quantity === undefined) {
      return next(new AppError('Missing required fields', 400));
  }

  // Check if item already exists in cart for the user
  const checkSql = 'SELECT * FROM cart WHERE user_id = ? AND item_id = ?';
  const insertSql = 'INSERT INTO cart (user_id, item_id, quantity) VALUES (?, ?, ?)';
  const updateSql = 'UPDATE cart SET quantity = quantity + ? WHERE user_id = ? AND item_id = ?';

  // Step 1: Check if item already exists
  db.query(checkSql, [user_id, item_id], (err, result) => {
      if (err) {
          console.error("Error in checkSql query:", err);
          return next(new AppError("Error checking cart item", 500));
      }

      // Step 2: Update or Insert based on existence
      if (result.length > 0) {
          // Item exists, update the quantity
          db.query(updateSql, [quantity, user_id, item_id], (err) => {
              if (err) {
                  console.error("Error in updateSql query:", err);
                  return next(new AppError("Failed to update item quantity", 500));
              }
              res.status(200).json({
                  status: "success",
                  message: "Item quantity updated in cart"
              });
          });
      } else {
          // Item does not exist, insert new item
          db.query(insertSql, [user_id, item_id, quantity], (err) => {
              if (err) {
                  console.error("Error in insertSql query:", err);
                  return next(new AppError("Failed to add item to cart", 500));
              }
              res.status(201).json({
                  status: "success",
                  message: "Item added to cart"
              });
          });
      }
  });
});

// Get items in user's cart
exports.getCartItems = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    const sql = 'SELECT * FROM cart WHERE user_id = ?';
    db.query(sql, [userId], (err, result) => {
        if (err) {
            return next(new AppError("Failed to fetch cart items", 500));
        }
        res.status(200).json({
            status: "success",
            data: {
                items: result
            }
        });
    });
});

// Remove item from cart
exports.removeItemFromCart = catchAsync(async (req, res, next) => {
    const { user_id, item_id } = req.body;

    if (!user_id || !item_id) {
        return next(new AppError("Missing required fields", 400));
    }

    const sql = 'DELETE FROM cart WHERE user_id = ? AND item_id = ?';
    db.query(sql, [user_id, item_id], (err) => {
        if (err) {
            return next(new AppError("Failed to remove item from cart", 500));
        }
        res.status(200).json({
            status: "success",
            message: "Item removed from cart"
        });
    });
});
