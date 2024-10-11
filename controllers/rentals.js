const Rental = require('../model/rental'); // Adjust the path as necessary
const db =require('../db_connections/dbConnect');
const jwt = require("jsonwebtoken");
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
                    message: "This user hasn't rented anything yet!"
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
const getRentalsByItem = async (req, res) => {
    try {
        const itemId = req.params.id;

        const sql =`SELECT * FROM  rentals WHERE item_id= ?`;

        db.query(sql,[itemId] ,(error, results) => {
            if (error) {
                console.error('Error retrieving rentals:', error);
                return res.status(500).json({
                    message: 'Error retrieving rentals',
                    error: error.message
                });
            }
            if (results.length === 0) {
                return res.status(404).json({
                    message: "This item hasn't rented yet!"
                });
            }
    
            return res.status(200).json({
                message: 'Rentals retrieved successfully',
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
const updateStatus = async (req, res) => {
    try {
        const rentalId = req.params.id;
        const newstatus = req.body.status;


        const sql =`UPDATE rentals set status = ? WHERE rental_id= ?`;

        db.query(sql,[newstatus,rentalId] ,(error, results) => {
            if (error) {
                console.error('Error updating status:', error);
                return res.status(500).json({
                    message: 'Error updating status',
                    error: error.message
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Rental not found or status not changed"
                });
            }
    
            const selectSql = 'SELECT * FROM rentals WHERE rental_id = ?';
            db.query(selectSql, [rentalId], (selectError, rentalResults) => {
            if (selectError) {
                console.error("Error retrieving updated rental:", selectError);
                return res.status(500).json({
                    message: "Error retrieving updated rental",
                    error: selectError.message || "An error occurred"
                });
            }

            // Send back the updated rental data
            return res.status(200).json({
                message: "Rental status updated successfully",
                updatedRental: rentalResults[0] // Send the first and only result
            });
        });
        });

    } catch (error) {
        console.error("Error updating rental:", error);
        return res.status(500).json({
            message: "Error updating rental",
            error: error.message || "An error occurred"
        });
    }
};


const updatePrice = async (req, res) => {
    try {
        const rentalId = req.params.id;
        const price = req.body.total_price;


        const sql =`UPDATE rentals set total_price = ? WHERE rental_id= ?`;

        db.query(sql,[price,rentalId] ,(error, results) => {
            if (error) {
                console.error('Error updating price:', error);
                return res.status(500).json({
                    message: 'Error updating price',
                    error: error.message
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Rental not found or price not changed"
                });
            }
    
            const selectSql = 'SELECT * FROM rentals WHERE rental_id = ?';
            db.query(selectSql, [rentalId], (selectError, rentalResults) => {
            if (selectError) {
                console.error("Error retrieving updated rental:", selectError);
                return res.status(500).json({
                    message: "Error retrieving updated rental",
                    error: selectError.message || "An error occurred"
                });
            }

            // Send back the updated rental data
            return res.status(200).json({
                message: "Rental price updated successfully",
                updatedRental: rentalResults[0] // Send the first and only result
            });
        });
        });

    } catch (error) {
        console.error("Error updating rental:", error);
        return res.status(500).json({
            message: "Error updating rental",
            error: error.message || "An error occurred"
        });
    }
};
const updateDates = (req, res) => {
    const rentalId = req.params.id; 
    const { start_date, end_date } = req.body;


    if (!start_date && !end_date) {
        return res.status(400).json({
            message: "Please provide at least one of start_date or end_date to update"
        });
    }
    if (start_date && end_date) {
        const startDate = new Date(start_date);
        const endDate = new Date(end_date);
        if (startDate >= endDate) {
            return res.status(400).json({
                message: "Start date must be before end date"
            });
        }
    }


    let updateFields = [];
    let values = [];

    if (start_date) {
        updateFields.push("start_date = ?");
        values.push(start_date);
    }
    if (end_date) {
        updateFields.push("end_date = ?");
        values.push(end_date);
    }

    const updateSql = `UPDATE rentals SET ${updateFields.join(', ')} WHERE rental_id = ?`;
    values.push(rentalId); 


    db.query(updateSql, values, (error, results) => {
        if (error) {
            console.error("Error updating rental dates:", error);
            return res.status(500).json({
                message: "Error updating rental dates",
                error: error.message || "An error occurred"
            });
        }

      if (results.affectedRows === 0) {
            return res.status(404).json({
                message: "Rental not found or dates not changed"
            });
        }


        const selectSql = 'SELECT * FROM rentals WHERE rental_id = ?';
        db.query(selectSql, [rentalId], (selectError, rentalResults) => {
            if (selectError) {
                console.error("Error retrieving updated rental:", selectError);
                return res.status(500).json({
                    message: "Error retrieving updated rental",
                    error: selectError.message || "An error occurred"
                });
            }

            // Send back the updated rental data
            return res.status(200).json({
                message: "Rental dates updated successfully",
                updatedRental: rentalResults[0] // Send the first and only result
            });
        });
    });
};

const updateLateFeesController = (req, res) => {
    const { rental_id, returnDate, lateFeePerDay } = req.body;

    if (!rental_id || !returnDate || !lateFeePerDay) {
        return res.status(400).json({ message: "Missing required fields: rental_id, returnDate, lateFeePerDay" });
    }

    // Fetch the rental data from the database using the rental_id
    const query = 'SELECT end_date, late_fee FROM rentals WHERE rental_id = ?';
    
    db.query(query, [rental_id], (err, results) => {
        if (err) {
            console.error("Error fetching rental data:", err);
            return res.status(500).json({ message: "Error fetching rental data", error: err.message });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: "Rental not found" });
        }

        const rental = results[0];
        const { end_date } = rental;

        // Calculate the late fees based on the returnDate and endDate
        const lateFees = calculateLateFees(end_date, returnDate, lateFeePerDay);

        // Update the late fee in the database
        const updateQuery = 'UPDATE rentals SET late_fee = ? WHERE rental_id = ?';
        db.query(updateQuery, [lateFees.totalLateFee, rental_id], (updateErr, updateResults) => {
            if (updateErr) {
                console.error("Error updating late fees:", updateErr);
                return res.status(500).json({ message: "Error updating late fees", error: updateErr.message });
            }

            // Return the updated rental details
            return res.status(200).json({
                message: "Late fees updated successfully",
                rental_id,
                lateFees,
                updatedRental: { ...rental, late_fee: lateFees.totalLateFee }
            });
        });
    });
};

// Late fee calculation logic
const calculateLateFees = (endDate, returnDate, lateFeePerDay) => {
    const end = new Date(endDate);
    const returned = new Date(returnDate);

    // Calculate the number of late days
    const lateDays = returned > end ? Math.ceil((returned - end) / (1000 * 60 * 60 * 24)) : 0;
    const totalLateFee = lateDays * lateFeePerDay;

    return {
        lateDays,
        totalLateFee
    };
};
const deleteRental = async (req, res) => {
    try {
        const rentalId = req.params.id;
        if (!rentalId) {
            return res.status(400).json({ message: "Missing rental_id parameter" });
        }
    

        const sql =`DELETE FROM rentals WHERE rental_id= ?`;

        db.query(sql,[rentalId] ,(error, results) => {
            if (error) {
                console.error('Error deleting rental:', error);
                return res.status(500).json({
                    message: 'Error deleting rental',
                    error: error.message
                });
            }
            if (results.affectedRows === 0) {
                return res.status(404).json({ message: "Rental not found" });
            }
    
            return res.status(200).json({
                message: 'Rental deleted successfully',
                // rental: results // Return the list of rentals
            });
        });

    } catch (error) {
        console.error("Error deleting rental:", error);
        return res.status(500).json({
            message: "Error deleting rental",
            error: error.message || "An error occurred"
        });
    }
};

module.exports = { registerRental,
    getAllRentals,
    getRentalById,
    getRentalsByUser,
    getRentalsByItem,
    updateStatus,
    updateDates,
    updatePrice,
    updateLateFeesController,
    deleteRental
 };
