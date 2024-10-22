const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const connection = require("../db_connections/dbConnect");
const Item = require("../models/itemModel");

// Create a new item
exports.createOne = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    category_id,
    owner_id,
    price_per_day,
    availability_status,
  } = req.body;
  const sql = `INSERT INTO Item (name, description, category_id, owner_id, price_per_day, availability_status) VALUES (?, ?, ?, ?, ?, ?)`;

  connection.query(
    sql,
    [
      name,
      description,
      category_id,
      owner_id,
      price_per_day,
      availability_status,
    ],
    (err, result) => {
      if (err) {
        return next(new AppError("Error creating item", 500));
      }
      res.status(201).json({
        status: "success",
        data: {
          data: { item_id: result.insertId, ...req.body }, // Return the created item
        },
      });
    }
  );
});

// Get one item by ID
exports.getOne = catchAsync(async (req, res, next) => {
  const sql = `SELECT * FROM Item WHERE item_id = ?`;

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return next(new AppError("Error fetching item", 500));
    }
    if (result.length === 0) {
      return next(new AppError("No item found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: result[0], // Return the first found result
      },
    });
  });
});

// Get all items with optional filtering
exports.getAll = catchAsync(async (req, res, next) => {
  let sql = `SELECT * FROM Item`;
  const queryParams = [];

  if (req.query.category_id) {
    sql += ` WHERE category_id = ?`;
    queryParams.push(req.query.category_id);
  }

  connection.query(sql, queryParams, (err, results) => {
    if (err) {
      return next(new AppError("Error fetching items", 500));
    }
    res.status(200).json({
      status: "success",
      results: results.length,
      data: {
        data: results,
      },
    });
  });
});

// Update an item by ID
exports.updateOne = catchAsync(async (req, res, next) => {
  const sql = `UPDATE Item SET ? WHERE item_id = ?`;

  connection.query(sql, [req.body, req.params.id], (err, result) => {
    if (err) {
      return next(new AppError("Error updating item", 500));
    }
    if (result.affectedRows === 0) {
      return next(new AppError("No item found with that ID", 404));
    }
    res.status(200).json({
      status: "success",
      data: {
        data: { item_id: req.params.id, ...req.body }, // Return the updated item data
      },
    });
  });
});

// Delete an item by ID
exports.deleteOne = catchAsync(async (req, res, next) => {
  const sql = `DELETE FROM Item WHERE item_id = ?`;

  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return next(new AppError("Error deleting item", 500));
    }
    if (result.affectedRows === 0) {
      return next(new AppError("No item found with that ID", 404));
    }
    res.status(204).json({
      status: "success",
      data: null,
    });
  });
});
exports.searchItems = catchAsync(async (req, res, next) => {
  const { name, category_id, minPrice, maxPrice, availability } = req.query;

  const items = await Item.search({
    name,
    category_id,
    minPrice,
    maxPrice,
    availability,
  });

  if (!items || items.length === 0) {
    return next(
      new AppError("No items found with the specified criteria", 404)
    );
  }

  res.status(200).json({
    status: "success",
    results: items.length,
    data: {
      items,
    },
  });
});
