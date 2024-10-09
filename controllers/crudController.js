const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const connection = require("../db_connections/dbConnect"); // Assuming you have a db connection

exports.deleteOne = (table) =>
  catchAsync(async (req, res, next) => {
    const sql = `DELETE FROM ${table} WHERE id = ?`;

    connection.query(sql, [req.params.id], (err, result) => {
      if (err) {
        return next(new AppError("Error deleting document", 500));
      }

      if (result.affectedRows === 0) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(204).json({
        status: "success",
        data: null,
      });
    });
  });

exports.updateOne = (table) =>
  catchAsync(async (req, res, next) => {
    const sql = `UPDATE ${table} SET ? WHERE id = ?`;

    connection.query(sql, [req.body, req.params.id], (err, result) => {
      if (err) {
        return next(new AppError("Error updating document", 500));
      }

      if (result.affectedRows === 0) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          data: result,
        },
      });
    });
  });

exports.createOne = (table) =>
  catchAsync(async (req, res, next) => {
    const sql = `INSERT INTO ${table} SET ?`;

    connection.query(sql, req.body, (err, result) => {
      if (err) {
        return next(new AppError("Error creating document", 500));
      }

      res.status(201).json({
        status: "success",
        data: {
          data: { id: result.insertId, ...req.body }, // Return the created document
        },
      });
    });
  });

exports.getOne = (table) =>
  catchAsync(async (req, res, next) => {
    const sql = `SELECT * FROM ${table} WHERE user_id = ?`;
    console.log(sql, req.params.id);
    connection.query(sql, [req.params.id], (err, result) => {
      if (err) {
        return next(new AppError("Error fetching document", 500));
      }

      if (result.length === 0) {
        return next(new AppError("No document found with that ID", 404));
      }

      res.status(200).json({
        status: "success",
        data: {
          data: result[0], // Return the first found result
        },
      });
    });
  });

exports.getAll = (table) =>
  catchAsync(async (req, res, next) => {
    let sql = `SELECT * FROM ${table}`;

    // If you want to support filtering, you can add conditions to the SQL query based on `req.query`
    // Example for filtering by a specific column:
    if (req.query.field) {
      sql += ` WHERE field = ?`;
    }

    connection.query(sql, [req.query.field], (err, results) => {
      if (err) {
        return next(new AppError("Error fetching documents", 500));
      }

      res.status(200).json({
        status: "success",
        results: results.length,
        data: {
          data: results,
        },
      });
    });

    exports.getOneByParam = (table, param, value) =>
      catchAsync(async (req, res, next) => {
        const sql = `SELECT * FROM ${table} WHERE ${param} = ?`;

        connection.query(sql, [value], (err, result) => {
          if (err) {
            return next(new AppError("Error fetching document", 500));
          }

          if (result.length === 0) {
            return next(
              new AppError(`No document found with the given ${param}`, 404)
            );
          }

          res.status(200).json({
            status: "success",
            data: {
              data: result[0], // Return the first found result
            },
          });
        });
      });
  });

exports.getOneByParam = (table, param, value) =>
  catchAsync(async (req, res, next) => {
    const sql = `SELECT * FROM ${table} WHERE ${param} = ?`;

    connection.query(sql, [value], (err, result) => {
      if (err) {
        return next(new AppError("Error fetching document", 500));
      }

      if (result.length === 0) {
        return next(
          new AppError(`No document found with the given ${param}`, 404)
        );
      }

      res.status(200).json({
        status: "success",
        data: {
          data: result[0], // Return the first found result
        },
      });
    });
  });

exports.findOneByParam = async (table, query) => {
  // Validate the input
  if (typeof query !== "object" || query === null) {
    throw new Error("Query must be a non-null object.");
  }

  let sql = `SELECT * FROM ?? WHERE `;
  const conditions = [];
  const values = [];

  // Loop through the query object to construct conditions and values
  for (const [key, value] of Object.entries(query)) {
    if (key && value !== undefined) {
      conditions.push(`${key} = ?`); // Construct the condition
      values.push(value); // Add the value to the array
    }
  }

  if (conditions.length === 0) {
    throw new Error("No valid conditions provided in the query.");
  }

  sql += conditions.join(" AND "); // Join all conditions with 'AND'

  // Execute the query using connection.query instead of connection.execute
  return new Promise((resolve, reject) => {
    connection.query(sql, [table, ...values], (err, rows) => {
      if (err) {
        return reject(err); // Handle the error
      }

      // Check if rows is an array before accessing its length
      if (!Array.isArray(rows)) {
        return reject(new Error("Query did not return an array."));
      }

      // Resolve the promise with the first row or null
      resolve(rows.length > 0 ? rows : null);
    });
  });
};
