const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");
const connection = require("../db_connections/dbConnect");
const Item = require('../models/itemModel');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        } else {
            cb(new AppError("Only images are allowed", 400));
        }
    }
});


exports.createOne = [
    upload.single('image'), // Image field is handled with multer
    catchAsync(async (req, res, next) => {
        console.log("Incoming request body:", req.body);
        console.log("File data:", req.file);

        
        const { name, description, category_id, owner_id, price_per_day, availability_status } = req.body; 
        const imagePath = req.file ? req.file.path : null; // Get the image path if uploaded

        const sql = `INSERT INTO Item (name, description, category_id, owner_id, price_per_day, availability_status, image) VALUES (?, ?, ?, ?, ?, ?, ?)`;
        const values = [name, description, category_id, owner_id, price_per_day, availability_status, imagePath];

        console.log(sql, values); // Log the query and values

        connection.query(sql, values, (err, result) => {
            if (err) {
                console.error("Database error:", err); // Log the error
                return next(new AppError("Error creating item", 500));
            }
            res.status(201).json({
                status: "success",
                data: {
                    item_id: result.insertId,
                    name,
                    description,
                    category_id,
                    owner_id,
                    price_per_day,
                    availability_status,
                    image: imagePath, // Return the uploaded image path
                },
            });
        });
    })
];
exports.getRecommendedItems = catchAsync(async (req, res, next) => {
    const { userId } = req.params;

    // Step 1: Find most rented categories by this user
    const categorySql = `
        SELECT i.category_id, COUNT(*) AS rental_count
        FROM rentals r
        JOIN Item i ON r.item_id = i.item_id
        WHERE r.renter_id = ?
        GROUP BY i.category_id
        ORDER BY rental_count DESC
        LIMIT 3;
    `;

    connection.query(categorySql, [userId], (err, categoryResults) => {
        if (err) {
            console.error("Database error:", err);
            return next(new AppError("Error fetching rental history", 500));
        }

        if (categoryResults.length === 0) {
            return res.status(200).json({
                status: "success",
                data: { recommendedItems: [] }
            });
        }

        const categoryIds = categoryResults.map(row => row.category_id);

        
        const ownerSql = `
            SELECT i.owner_id, i.category_id, COUNT(*) AS rental_count
            FROM rentals r
            JOIN Item i ON r.item_id = i.item_id
            WHERE r.renter_id = ? AND i.category_id IN (?)
            GROUP BY i.owner_id, i.category_id
            ORDER BY rental_count DESC;
        `;

        connection.query(ownerSql, [userId, categoryIds], (err, ownerResults) => {
            if (err) {
                console.error("Database error:", err);
                return next(new AppError("Error fetching frequent owners", 500));
            }

         
            const ownersByCategory = {};
            ownerResults.forEach(row => {
                if (!ownersByCategory[row.category_id]) {
                    ownersByCategory[row.category_id] = [];
                }
                ownersByCategory[row.category_id].push(row.owner_id);
            });

            //  Fetch recommended items based on these categories and owners
            const recommendationSql = `
                SELECT * FROM Item
                WHERE category_id IN (?)
                AND item_id NOT IN (
                    SELECT item_id FROM rentals WHERE renter_id = ?
                )
                AND (
                    ${categoryIds.map(categoryId => `
                        (category_id = ${categoryId} AND owner_id IN (${ownersByCategory[categoryId] || []}))
                    `).join(' OR ')}
                )
                ORDER BY FIELD(category_id, ?);
            `;

            connection.query(recommendationSql, [categoryIds, userId, categoryIds], (err, recommendedItems) => {
                if (err) {
                    console.error("Database error:", err);
                    return next(new AppError("Error fetching recommended items", 500));
                }

                res.status(200).json({
                    status: "success",
                    data: { recommendedItems }
                });
            });
        });
    });
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
                data: result[0],
            },
        });
    });
});
exports.getItemsByOwner = catchAsync(async (req, res, next) => {
    const ownerId = req.params.ownerId; // Get the owner ID from request parameters
    const sql = `SELECT * FROM Item WHERE owner_id = ?`;

    connection.query(sql, [ownerId], (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log any database error
            return next(new AppError("Error fetching items for the owner", 500));
        }
        console.log("Fetched items for owner:", results); // Log fetched items
        res.status(200).json({
            status: "success",
            results: results.length,
            data: {
                data: results,
            },
        });
    });
});


exports.getAll = catchAsync(async (req, res, next) => {
    let sql = `SELECT * FROM Item`;
    const queryParams = [];

    if (req.query.category_id) {
        sql += ` WHERE category_id = ?`;
        queryParams.push(req.query.category_id);
    }

    connection.query(sql, queryParams, (err, results) => {
        if (err) {
            console.error("Database error:", err); // Log any database error
            return next(new AppError("Error fetching items", 500));
        }
        console.log("Fetched items:", results); // Log fetched items
        res.status(200).json({
            status: "success",
            results: results.length,
            data: {
                data: results,
            },
        });
    });
});



exports.updateOne = [
    upload.single('image'), // Handle image upload
    catchAsync(async (req, res, next) => {
        const { name, description, price_per_day, availability_status, category_id, owner_id, image } = req.body; // Destructure req.body
        const item_id = req.params.id; // Get item ID from params

       
        const data = { name, description, price_per_day, availability_status, category_id, owner_id, image };

        // If a new image is uploaded, include it in the update data
        if (req.file) {
            data.image = req.file.path; // Add the image path to the update data if an image is provided
        }

        const sql = `UPDATE Item SET ? WHERE item_id = ?`;

        connection.query(sql, [data, item_id], (err, result) => {
            if (err) {
                console.error("Database error:", err); // Log the error for debugging
                return next(new AppError("Error updating item", 500));
            }
            if (result.affectedRows === 0) {
                return next(new AppError("No item found with that ID", 404));
            }
            res.status(200).json({
                status: "success",
                data: {
                    data: { item_id, ...data }, // Return updated item data
                },
            });
        });
    })
];


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

    const items = await Item.search({ name, category_id, minPrice, maxPrice, availability });

    if (!items || items.length === 0) {
        return next(new AppError("No items found with the specified criteria", 404));
    }

    res.status(200).json({
        status: "success",
        results: items.length,
        data: {
            items,
        },
    });
});
