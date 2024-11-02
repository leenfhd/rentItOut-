const express = require("express");
const router = express.Router();
const connection = require("../db_connections/dbConnect");
const AppError = require("../utils/appError");

// Simple login route
router.post('/login', (req, res, next) => {
    const { email, password } = req.body;

    // Basic validation
    if (!email || !password) {
        return next(new AppError('Please provide email and password', 400));
    }

    const sql = 'SELECT * FROM user WHERE email = ? AND password = ?';
    connection.query(sql, [email, password], (err, results) => {
        if (err) {
            return next(new AppError('Database error during login', 500));
        }

        if (results.length > 0) {
            // Login successful
            res.status(200).json({
                status: "success",
                data: {
                    user: results[0]
                }
            });
        } else {
            // Login failed
            return next(new AppError('Invalid email or passwordd', 401));
        }
    });
});

module.exports = router;
