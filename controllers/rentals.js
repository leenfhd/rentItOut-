const Rental = require('../model/rental'); // Adjust the path as necessary
const db =require('../db_connections/dbConnect');
// Controller function to register rental
const registerRental = async (req, res) => {
    try {
        const {
            item_id,
            renter_id,
            owner_id,
            start_date,
            end_date,
            total_price,
            late_fee,
            status } = req.body;


        const sql =`INSERT INTO rentals (item_id, renter_id, owner_id, start_date, end_date, total_price, late_fee, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
        

        const rentalData = [
            item_id,
            renter_id,
            owner_id,
            start_date,
            end_date,
            total_price,
            late_fee,
            status,
            new Date()
        ];

        db.query(sql, rentalData, (error, results) => {
            if (error) {
                console.error('Error registering rental:', error);
                return res.status(500).json({
                    message: 'Error registering rental',
                    error: error.message
                });
            }
    
            return res.status(201).json({
                message: 'Rental registered successfully',
                rentalId: results.insertId // Return the inserted ID
            });
        });

    } catch (error) {
        console.error("Error registering rental:", error);
        return res.status(500).json({
            message: "Error registering rental",
            error: error.message || "An error occurred"
        });
    }
};


const getAllRentals = async (req, res) => {
    try {

        const sql =`SELECT * FROM  rentals `;

        db.query(sql, (error, results) => {
            if (error) {
                console.error('Error getting rentals:', error);
                return res.status(500).json({
                    message: 'Error getting rentals',
                    error: error.message
                });
            }
    
            return res.status(201).json({
                message: 'Rentals retrieved successfully',
                rentals: results // Return the list of rentals
            });
        });

    } catch (error) {
        console.error("Error getting rentals:", error);
        return res.status(500).json({
            message: "Error getting rentals",
            error: error.message || "An error occurred"
        });
    }
};
const getRentalById = async (req, res) => {
    try {
        const rentalId = req.params.id;

        const sql =`SELECT * FROM  rentals WHERE rental_id= ?`;

        db.query(sql,[rentalId] ,(error, results) => {
            if (error) {
                console.error('Error retrieving rental:', error);
                return res.status(500).json({
                    message: 'Error retrieving rental',
                    error: error.message
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: "No rental found with thid id"
                });
            }
    
            return res.status(200).json({
                message: 'Rental retrieved successfully',
                rental: results // Return the list of rentals
            });
        });

    } catch (error) {
        console.error("Error getting rental:", error);
        return res.status(500).json({
            message: "Error getting rental",
            error: error.message || "An error occurred"
        });
    }
};
const getRentalsByUser = async (req, res) => {
    try {
        const userID = req.params.id;

        const sql =`SELECT * FROM  rentals WHERE renter_id= ?`;

        db.query(sql,[userID] ,(error, results) => {
            if (error) {
                console.error('Error retrieving rental:', error);
                return res.status(500).json({
                    message: 'Error retrieving rental',
                    error: error.message
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: "This user hasn't rental anything yet!"
                });
            }
    
            return res.status(200).json({
                message: 'Rental retrieved successfully',
                rental: results // Return the list of rentals
            });
        });

    } catch (error) {
        console.error("Error getting rental:", error);
        return res.status(500).json({
            message: "Error getting rental",
            error: error.message || "An error occurred"
        });
    }
};

module.exports = { registerRental,
    getAllRentals,
    getRentalById,
    getRentalsByUser
 };