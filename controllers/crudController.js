const AppError = require("../utils/appError");
const connection = require("../db_connections/dbConnect");
const { query } = require("express");

exports.updateOne = async (table, req, res, next) => {
  const id = req.params.id;
  const updates = req.body;

  const setClause = Object.keys(updates)
    .map((key) => `${key} = ?`)
    .join(", ");

  const values = Object.values(updates);
  values.push(id);
  let idName;
  if (table === "users") {
    idName = "user_id";
  } else {
    idName = `${table}_id`;
  }
  const query = `UPDATE ${table} SET ${setClause} WHERE ${idName} = ?`;

  const [result] = await connection.promise().query(query, values);

  if (result.affectedRows === 0) {
    return next(new AppError("No document found with that id", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      data: updates,
    },
  });
};
exports.deleteOne = async (table, req, res, next) => {
  let idName;
  if (table === "users") {
    idName = "user_id";
  } else {
    idName = `${table}_id`;
  }
  const sql = `DELETE FROM ?? WHERE ${idName} = ?`;
  const [result] = await connection
    .promise()
    .query(sql, [table, req.params.id]);

  if (result.affectedRows === 0) {
    return next(new AppError("No document found with that id", 404));
  }

  res.status(204).json({
    status: "success",
    data: null,
  });
};

exports.createOne = async (table, req, res, next) => {
  const sql = `INSERT INTO ?? SET ?`;

  try {
    const [result] = await connection.promise().query(sql, [table, req.body]);

    res.status(201).json({
      status: "success",
      data: {
        data: { id: result.insertId, ...req.body }, // Return the created document
      },
    });
  } catch (err) {
    return next(new AppError("Error creating document", 500));
  }
};

exports.getOne = (table, req, res, next) => {
  const sql = `SELECT * FROM ${table} WHERE user_id = ?`;
  connection.query(sql, [req.params.id], (err, result) => {
    if (err) {
      return next(new AppError("Error fetching document", 500));
    }

    if (result.length === 0) {
      return next(new AppError("No document found with that user_id", 404));
    }

    res.status(200).json({
      status: "success",
      data: {
        data: result[0],
      },
    });
  });
};

function filter(table, queryString) {
  let query = "";
  let queryParams = [];
  const operatorMap = {
    gte: ">=",
    gt: ">",
    lte: "<=",
    lt: "<",
  };

  const queryObj = { ...queryString };
  ["sort", "limit"].forEach((item) => delete queryObj[item]);

  let whereClause = "";
  const whereParams = [];

  // Build the WHERE clause
  for (const key in queryObj) {
    const value = queryObj[key];
    if (typeof value === "object" && value !== null) {
      for (const op in value) {
        if (operatorMap[op]) {
          whereClause += whereClause ? " AND " : " WHERE ";
          whereClause += `${key} ${operatorMap[op]} ?`;
          whereParams.push(value[op]);
        }
      }
    } else {
      whereClause += whereClause ? " AND " : " WHERE ";
      whereClause += `${key} = ?`;
      whereParams.push(value);
    }
  }

  // Build the ORDER BY clause
  let sortBy = "";
  if (queryString.sort) {
    const sortFields = queryString.sort.split(",").map((field) => {
      if (field.startsWith("-")) {
        return `${field.slice(1)} DESC`;
      } else {
        return field;
      }
    });
    sortBy = ` ORDER BY ${sortFields.join(", ")}`;
  } else {
    sortBy = " ORDER BY created_at ASC";
  }

  // Build the LIMIT clause
  let limitClause = "";
  if (queryString.limit) {
    const limit = parseInt(queryString.limit);
    limitClause = ` LIMIT ?`;
    whereParams.push(limit);
  }

  // Combine everything into the final query
  query = `SELECT * FROM ${table}${whereClause}${sortBy}${limitClause}`;
  queryParams = whereParams;
  return { query, queryParams };
}

exports.getAll = async (table, req, res, next) => {
  const { query, queryParams } = filter(table, req.query);
  connection.query(query, queryParams, (error, results) => {
    if (error) {
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
};

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
exports.findAndUpdate = async (table, id, updateData) => {
  // Validate input
  if (typeof id !== "object" || id === null) {
    throw new Error("Find query must be a non-null object.");
  }

  if (typeof updateData !== "object" || updateData === null) {
    throw new Error("Update data must be a non-null object.");
  }

  // Step 1: Find the record using findOneByParam (assuming it's for a single field, or adapt for multiple)
  const keys = Object.keys(id);
  const param = keys[0]; // Get the first key from the find query
  const value = id[param]; // Get the value for the param

  const foundRecord = await exports.findOneByParam(table, param, value);

  if (!foundRecord) {
    // No record found
    return null;
  }

  // Step 2: Update the found record
  return new Promise((resolve, reject) => {
    const updateSql = `UPDATE ?? SET ? WHERE ?? = ?`;

    // Construct the SQL query to update the found record based on the condition
    const queryParams = [table, updateData, param, value]; // Update the record based on the condition

    // Execute the update query
    connection.query(updateSql, queryParams, (err, result) => {
      if (err) {
        return reject(err); // Handle SQL error
      }

      if (result.affectedRows === 0) {
        return resolve(null); // No rows were updated
      }

      // Step 3: Return the updated record (could return the updated data or re-fetch)
      const updatedRecord = { ...foundRecord, ...updateData }; // Merge the old and new data
      resolve(updatedRecord); // Resolve with the updated record
    });
  });
};
