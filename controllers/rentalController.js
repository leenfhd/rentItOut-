const Rental = require('../model/rentalModel'); // Adjust the path as necessary
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

const getRentals = async (req, res) => {
    try {
        const { rental_id, renter_id,owner_id, item_id, status } = req.query; // Expect query parameters

        let sql = "SELECT * FROM rentals WHERE 1 = 1";
        const queryParams = [];

        
        if (rental_id) {
            sql += " AND rental_id = ?";
            queryParams.push(rental_id);
        }
        if (renter_id) {
            sql += " AND renter_id = ?";
            queryParams.push(renter_id);
        }
        if (owner_id) {
            sql += " AND owner_id = ?";
            queryParams.push(owner_id);
        }
        if (item_id) {
            sql += " AND item_id = ?";
            queryParams.push(item_id);
        }
        if (status) {
            sql += " AND status = ?";
            queryParams.push(status);
        }

        
        if (queryParams.length === 0) {
            return res.status(400).json({
                message: "Please provide at least one parameter: rental_id, renter_id,owner_id, item_id or status"
            });
        }

  
        db.query(sql, queryParams, (error, results) => {
            if (error) {
                console.error('Error retrieving rentals:', error);
                return res.status(500).json({
                    message: 'Error retrieving rentals',
                    error: error.message
                });
            }

            if (results.length === 0) {
                return res.status(404).json({
                    message: "No rentals found with the provided criteria"
                });
            }

            return res.status(200).json({
                message: 'Rentals retrieved successfully',
                rentals: results
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


const updateRental = async (req, res) => {
    try {
        const rental_id = req.params.id;
        const { status, total_price, start_date, end_date } = req.body;

        // Check if at least one field is provided for updating
        if (!status && !total_price && !start_date && !end_date) {
            return res.status(400).json({
                message: "Please provide at least one field to update (status, price, start_date, end_date)"
            });
        }

        // Start building the update query dynamically
        let updateFields = [];
        let values = [];

        // Add status to the update if it's provided
        if (status) {
            updateFields.push("status = ?");
            values.push(status);
        }

        // Add total_price to the update if it's provided
        if (total_price) {
            updateFields.push("total_price = ?");
            values.push(total_price);
        }

        // Validate and add start_date and end_date to the update if provided
        if (start_date) {
            updateFields.push("start_date = ?");
            values.push(start_date);
        }
        if (end_date) {
            updateFields.push("end_date = ?");
            values.push(end_date);
        }

        // Ensure that start_date is before end_date (if both are provided)
        if (start_date && end_date) {
            const startDateObj = new Date(start_date);
            const endDateObj = new Date(end_date);
            if (startDateObj >= endDateObj) {
                return res.status(400).json({
                    message: "Start date must be before end date"
                });
            }
        }

        // Build the SQL query dynamically
        const updateSql = `UPDATE rentals SET ${updateFields.join(', ')} WHERE rental_id = ?`;
        values.push(rental_id);  // Append rental ID as the last value

        // Execute the update query
        db.query(updateSql, values, (error, results) => {
            if (error) {
                console.error('Error updating rental:', error);
                return res.status(500).json({
                    message: 'Error updating rental',
                    error: error.message
                });
            }

            if (results.affectedRows === 0) {
                return res.status(404).json({
                    message: "Rental not found or no fields updated"
                });
            }

            // Fetch the updated rental details to return
            const selectSql = 'SELECT * FROM rentals WHERE rental_id = ?';
            db.query(selectSql, [rental_id], (selectError, rentalResults) => {
                if (selectError) {
                    console.error("Error retrieving updated rental:", selectError);
                    return res.status(500).json({
                        message: "Error retrieving updated rental",
                        error: selectError.message || "An error occurred"
                    });
                }

                return res.status(200).json({
                    message: "Rental updated successfully",
                    updatedRental: rentalResults[0]
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



const updateLateFeesController = (req, res) => {
    const { rental_id, returnDate, lateFeePerDay } = req.body;

    if (!rental_id || !returnDate || !lateFeePerDay) {
        return res.status(400).json({ message: "Missing required fields: rental_id, returnDate, lateFeePerDay" });
    }

    
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
    updateLateFeesController,
    deleteRental,
    getRentals,
    updateRental
 };
