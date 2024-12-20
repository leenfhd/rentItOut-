const Rental = require("../models/rentalModel"); 
const db = require("../db_connections/dbConnect");
const jwt = require("jsonwebtoken");
const { message } = require("../models/notificationModel");
const catchAsync = require("../utils/catchAsync");

//new rental request
const registerRental = catchAsync (async(req, res,next) => {
  try {

    const { item_id, start_date, end_date,code } = req.body;
    const token = req.headers.authorization.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const renter_id = decoded.id;
    const userRoleQuery = "SELECT role FROM users WHERE user_id = ?";
    const [userResults] = await db.promise().query(userRoleQuery, [renter_id]);

    if (userResults.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const userRole = userResults[0].role; 
    console.log("role:" ,userRole);

    //just renter can rent
    if (userRole !== "renter" && userRole !== "both") {
        return res.status(403).json({
          message: "You are not a renter. You can't ask for renting.",
        });
      }
    const startDay = new Date(start_date);
    const endDay = new Date(end_date);
    if (startDay >= endDay) {
        return res.status(400).json({
          message: "The end date must be after the start date.",
        });
      } 
  

    const getItem = `SELECT owner_id, price_per_day, availability_status ,name as item_name  FROM item WHERE item_id = ?`;
    const [itemResult] = await db.promise().query(getItem, [item_id]);
    if (itemResult.length === 0) {
      return res.status(404).json({ message: "Item not found" });
    }
    const getCoupon = `SELECT *  FROM coupons WHERE code = ?`;
    const [couponResult] = await db.promise().query(getCoupon, [code]);
    if (couponResult.length === 0) {
      return res.status(404).json({ message: "There is no coupon with this code" });
    }


    const owner_id = itemResult[0].owner_id;
    const price_per_day = itemResult[0].price_per_day;
    const availability_status = itemResult[0].availability_status;
    const item_name=itemResult[0].item_name;
    const discount=couponResult[0].discount_percent;
    const valid_from=new Date(couponResult[0].valid_from);
    const valid_until=new Date(couponResult[0].valid_until);
    const currentDate=new Date();


    ///check for coupon
    if(startDay<valid_from || endDay>valid_until){//unavailable
          return res.status(400).json({
            message:"The coupon in not valid for thr current date"
          })
    }
    //Check for availability of the item

      const itemRentingHistory = `SELECT end_date FROM rentals Where item_id=? and status='ongoing' ORDER BY end_date DESC LIMIT 1`;

      const [itemHistory]=await db.promise().query(itemRentingHistory,[item_id]);
      if(itemHistory .length>0){//there is a previous rental for this item
        const previousRentalEndDate= new Date(itemHistory[0].end_date);
        const requestStartDate= new Date(start_date);

        if(previousRentalEndDate >= requestStartDate){//unavailable
          return res.status(400).json({
            message:"Item is already rented on the requested days"
          });
        }
        }else{
          return res.status(400).json({
            message: "Item is currently unavailable for new rentals.",
          });
        

    }


/////now both coupon and item available
 
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const rentalDays = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24));
    const total_price = rentalDays * price_per_day;
    const totalWithDiscount=total_price-(total_price*discount/100);
    const late_fee = 0;

    const sql = `INSERT INTO rentals (item_id, renter_id, owner_id, start_date, end_date, total_price, late_fee, status, created_at) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const rentalData = [
      item_id,
      renter_id,
      owner_id,
      start_date,
      end_date,
      totalWithDiscount,
      late_fee,
      "pending",
      new Date(),
    ];

    db.query(sql, rentalData, (error, results) => {
      if (error) {
        console.error("Error request for rental:", error);
        return res.status(500).json({
          message: "Error request for rental",
          error: error.message,
        });
      }
      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];


      return res.status(201).json({
        message: "Your request to rent this item sent successfully to its owner,please wait for his approve",
        rentalId: results.insertId,
        start_date: formattedStartDate,
        end_date: formattedEndDate, 
      });
    });
    const getUser = `SELECT first_name,last_name FROM users WHERE user_id = ?`;
    const [userResult] = await db.promise().query(getUser, [renter_id]);
    const firstName = userResult[0].first_name;
    const lastName = userResult[0].last_name;

    const notificationMessage= `${firstName} ${lastName}  requested to rent the item "${item_name}" from ${start_date} to ${end_date}`;
    const status ="unread";

    const sendNotification=`INSERT INTO notifications (user_id, message, status, created_at) VALUES (?, ?, ?, ?)`;
    const notificationData = [owner_id, notificationMessage, status, new Date()];
    await db.promise().query(sendNotification,notificationData);

  } catch (error) {
    console.error("Error request for rental:", error);
    return res.status(500).json({
      message: "Error request for rental",
      error: error.message || "An error occurred",
    });
  }
});

const getAllRentals = catchAsync(async (req, res) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    //check token + get current user
    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const userRoleQuery = "SELECT role FROM users WHERE user_id = ?"; 

    db.query(userRoleQuery, [userId], (error, results) => {
      if (error) {
        console.error("Error retrieving user role:", error);
        return res.status(500).json({
          message: "Error retrieving user role",
          error: error.message,
        });
      }


      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userRole = results[0].role; 
      console.log("role:" ,userRole);

     //specific for admin
      if (userRole !== "admin") {
        return res.status(403).json({
          message: "You are not an admin. You can't see all rentals.",
        });
      }


      const sql = `SELECT * FROM rentals`;

      db.query(sql, (error, results) => {
        if (error) {
          console.error("Error getting rentals:", error);
          return res.status(500).json({
            message: "Error getting rentals",
            error: error.message,
          });
        }

        const formattedResults = results.map((rental) => ({
          rental_id:rental.rental_id,
          item_id: rental.item_id,
          renter_id: rental.renter_id,
          owner_id: rental.owner_id,
          start_date: rental.start_date,
          end_date: rental.end_date,
          total_price: rental.total_price,
          late_fee: rental.late_fee,
          status: rental.status,
        }));

        return res.status(200).json({
          message: "Rentals retrieved successfully",
          rentals: formattedResults, 
        });
      });
    });
  } catch (error) {
    console.error("Error getting rentals:", error);
    return res.status(500).json({
      message: "Error getting rentals",
      error: error.message || "An error occurred",
    });
  }
});

const getRentals = async (req, res) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;


    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [user] = await db
      .promise()
      .query("SELECT role FROM users WHERE user_id = ?", [userId]);
    if (!user.length) {
      return res.status(404).json({
        message: "No user found with this ID.",
      });
    }

    const role = user[0].role;

    const { rental_id, renter_id, owner_id, item_id, status } = req.query; 

    let sql = "SELECT * FROM rentals WHERE 1 = 1";
    const queryParams = [];
    if (role === "admin") {
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
    } else if (role === "renter") {
      if (rental_id) {
        sql += " AND rental_id = ?";
        sql += " AND renter_id = ?";
        queryParams.push(rental_id, userId);
      }
      if (renter_id) {
        sql += " AND renter_id = ?";
        sql += " AND renter_id = ?";
        queryParams.push(renter_id, userId);
      }
      if (owner_id) {
        sql += " AND owner_id = ?";
        sql += " AND renter_id = ?";
        queryParams.push(owner_id, userId);
      }
      if (item_id) {
        sql += " AND item_id = ?";
        sql += " AND renter_id = ?";
        queryParams.push(item_id, userId);
      }
      if (status) {
        sql += " AND status = ?";
        sql += " AND renter_id = ?";
        queryParams.push(status, userId);
      }
    } else if (role == "owner") {
      if (rental_id) {
        sql += " AND rental_id = ?";
        sql += " AND owner_id = ?";
        queryParams.push(rental_id, userId);
      }
      if (renter_id) {
        sql += " AND renter_id = ?";
        sql += " AND owner_id = ?";
        queryParams.push(renter_id, userId);
      }
      if (owner_id) {
        sql += " AND owner_id = ?";
        sql += " AND owner_id = ?";
        queryParams.push(owner_id, userId);
      }
      if (item_id) {
        sql += " AND item_id = ?";
        sql += " AND owner_id = ?";
        queryParams.push(item_id, userId);
      }
      if (status) {
        sql += " AND status = ?";
        sql += " AND owner_id = ?";
        queryParams.push(status, userId);
      }
    } else if (role == "both") {
      if (rental_id) {
        sql += " AND rental_id = ?";
        sql += " AND (owner_id = ? OR renter_id= ?)";
        queryParams.push(rental_id, userId, userId);
      }
      if (renter_id) {
        sql += " AND renter_id = ?";
        sql += " AND (owner_id = ? OR renter_id= ?)";
        queryParams.push(renter_id, userId, userId);
      }
      if (owner_id) {
        sql += " AND owner_id = ?";
        sql += " AND (owner_id = ? OR renter_id= ?)";
        queryParams.push(owner_id, userId, userId);
      }
      if (item_id) {
        sql += " AND item_id = ?";
        sql += " AND (owner_id = ? OR renter_id= ?)";
        queryParams.push(item_id, userId, userId);
      }
      if (status) {
        sql += " AND status = ?";
        sql += " AND (owner_id = ? OR renter_id= ?)";
        queryParams.push(status, userId, userId);
      }
    }

    if (queryParams.length === 0) {
      return res.status(400).json({
        message:
          "Please provide at least one parameter: rental_id, renter_id,owner_id, item_id or status",
      });
    }

    db.query(sql, queryParams, (error, results) => {
      if (error) {
        console.error("Error retrieving rentals:", error);
        return res.status(500).json({
          message: "Error retrieving rentals",
          error: error.message,
        });
      }

      if (results.length === 0) {
        return res.status(404).json({
          message: "No rentals found with the provided criteria",
        });
      }

      const formattedResults = results.map((rental) => ({
        
        rental_id:rental.rental_id,
        item_id: rental.item_id,
        renter_id: rental.renter_id,
        owner_id: rental.owner_id,
        start_date: rental.start_date,
        end_date: rental.end_date,
        total_price: rental.total_price,
        late_fee: rental.late_fee,
        status: rental.status,
      }));

      return res.status(200).json({
        message: "Rentals retrieved successfully",
        rentals: formattedResults,
      });
    });
  } catch (error) {
    console.error("Error getting rentals:", error);
    return res.status(500).json({
      message: "Error getting rentals",
      error: error.message || "An error occurred",
    });
  }
};
const getLateRentals =catchAsync(async(req,res)=>{
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;

    
    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    //just for owner
    const userRoleQuery = "SELECT role FROM users WHERE user_id = ?"; 

    db.query(userRoleQuery, [userId], (error, results) => {
      if (error) {
        console.error("Error retrieving user role:", error);
        return res.status(500).json({
          message: "Error retrieving user role",
          error: error.message,
        });
      }


      if (results.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }
      const userRole=results[0].role;
    if(userRole!=="owner" && userRole!="both"){
      return res.status(403).json({
        message: "You cant see late rentals, you are not an owner",
      });
    }
    const getLate= `SELECT * FROM rentals
    WHERE owner_id = ? AND status = 'ongoing' AND end_date < CURDATE()`;
    db.query(getLate,[userId],(error,results)=>{
      if (error) {
        console.error("Error getting late rentals for owner:", error);
        return res.status(500).json({
          message: "Error getting late rentals",
          error: error.message,
        });
      }
      const formattedResults = results.map((rental) => ({
        rental_id:rental.rental_id,
        item_id: rental.item_id,
        renter_id: rental.renter_id,
        start_date: rental.start_date,
        end_date: rental.end_date,
        status: rental.status,
      }));
      return res.status(200).json({
        message: "Late rentals retrieved successfully for the owner",
        rentals: formattedResults, 
      });
    });

    });

  } catch (error) {
    console.error("Error retreiving late rentals:", error);
    return res.status(500).json({
      message: "Error retreiving late rentals",
      error: error.message || "An error occurred",
    });
  }
});

//response to pending requests
const acceptOrDenyRental = async (req, res) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;


    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

   
    const { rental_id, action } = req.body; 

    if (!rental_id || !action) {
      return res
        .status(400)
        .json({ message: "Please provide both rental_id and action." });
    }

    const [rental] = await db
      .promise()
      .query(
        "SELECT * FROM rentals WHERE rental_id = ? AND owner_id = ? AND status = 'pending'",
        [rental_id, userId]
      );

    if (!rental.length) {
      return res
        .status(404)
        .json({ message: "Rental not found or you are not the owner." });
    }


    const item_id=rental[0].item_id;
    const renter_id=rental[0].renter_id;

    let newStatus;
    let notificationMessage;
    if (action === "accept") {
      newStatus = "ongoing";
      notificationMessage= `Your request to rent item ${item_id} has been accepted`;


  
      await db.promise().query("UPDATE item SET availability_status = 'unavailable' WHERE item_id=?", [item_id]);

    } else if (action === "deny") {
      newStatus = "cancelled";
      notificationMessage=`Your request to rent item ${item_id} has been denied`;
    } else {
      return res
        .status(400)
        .json({ message: "Invalid action. Use 'accept' or 'deny'." });
    }

    // Update the rental status in the database
    await db
      .promise()
      .query("UPDATE rentals SET status = ? WHERE rental_id = ?", [
        newStatus,
        rental_id,
      ]);

      const notificationSql = `INSERT INTO notifications (user_id, message, status, created_at) VALUES (?, ?, ?, ?)`;
      await db
        .promise()
        .query(notificationSql, [
          renter_id,
          notificationMessage,
          "unread",
          new Date(),
        ]);

    return res.status(200).json({
      message: `Rental ${action}ed successfully.`,
      rental_id,
      newStatus,
    });
  } catch (error) {
    console.error("Error updating rental status:", error);
    return res.status(500).json({
      message: "Error updating rental status",
      error: error.message || "An error occurred",
    });
  }
};

const updateRental = async (req, res) => {
  try {
    const token =
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
        ? req.headers.authorization.split(" ")[1]
        : null;


    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please log in." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;
    const rental_id = req.params.id;
    const { status, total_price, start_date, end_date } = req.body;


    if (!status && !total_price && !start_date && !end_date) {
      return res.status(400).json({
        message:
          "Please provide at least one field to update (status, price, start_date, end_date)",
      });
    }
    const userRoleQuery = "SELECT role FROM users WHERE user_id = ?";
    db.query(userRoleQuery, [userId], (roleError, roleResults) => {
      if (roleError) {
        console.error("Error retrieving user role:", roleError);
        return res.status(500).json({
          message: "Error retrieving user role",
          error: roleError.message,
        });
      }

      if (roleResults.length === 0) {
        return res.status(404).json({
          message: "User not found",
        });
      }

      const userRole = roleResults[0].role;
      if (userRole !== "owner" && userRole !== "both") {
        return res.status(403).json({
          message: "You do not have permission to update this rental",
        });
      }


    let updateFields = [];
    let values = [];

   
    if (status) {
      updateFields.push("status = ?");
      values.push(status);
    }

 
    if (total_price) {
      updateFields.push("total_price = ?");
      values.push(total_price);
    }

  
    if (start_date) {
      updateFields.push("start_date = ?");
      values.push(start_date);
    }
    if (end_date) {
      updateFields.push("end_date = ?");
      values.push(end_date);
    }

    //check for start date is before end date
    if (start_date && end_date) {
      const startDateObj = new Date(start_date);
      const endDateObj = new Date(end_date);
      if (startDateObj >= endDateObj) {
        return res.status(400).json({
          message: "Start date must be before end date",
        });
      }
    }

   
    const updateSql = `UPDATE rentals SET ${updateFields.join(
      ", "
    )} WHERE rental_id = ?`;
    values.push(rental_id); 


    db.query(updateSql, values, (error, results) => {
      if (error) {
        console.error("Error updating rental:", error);
        return res.status(500).json({
          message: "Error updating rental",
          error: error.message,
        });
      }

      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Rental not found or no fields updated",
        });
      }

      const selectSql = "SELECT * FROM rentals WHERE rental_id = ?";
      db.query(selectSql, [rental_id], (selectError, rentalResults) => {
        if (selectError) {
          console.error("Error retrieving updated rental:", selectError);
          return res.status(500).json({
            message: "Error retrieving updated rental",
            error: selectError.message || "An error occurred",
          });
        }

        return res.status(200).json({
          message: "Rental updated successfully",
          updatedRental: rentalResults[0],
        });
      });
    });
  });
  } catch (error) {
    console.error("Error updating rental:", error);
    return res.status(500).json({
      message: "Error updating rental",
      error: error.message || "An error occurred",
    });
  }
};

//add fees for late rentals
const updateLateFeesController = (req, res) => {
  const { rental_id, returnDate, lateFeePerDay } = req.body;

  if (!rental_id || !returnDate || !lateFeePerDay) {
    return res
      .status(400)
      .json({
        message:
          "Missing required fields: rental_id, returnDate, lateFeePerDay",
      });
  }

  const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

  if (!token) {
    return res
      .status(401)
      .json({ message: "You are not authorized. Please log in." });
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const userId = decoded.id;

  const query = "SELECT end_date, late_fee, owner_id FROM rentals WHERE rental_id = ?";

  db.query(query, [rental_id], (err, results) => {
    if (err) {
      console.error("Error fetching rental data:", err);
      return res
        .status(500)
        .json({ message: "Error fetching rental data", error: err.message });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: "Rental not found" });
    }

    const rental = results[0];
    const { end_date, owner_id } = rental;

    if(owner_id!= userId){
      return res.status(403).json({
        message:"You are not the owner of this rental, You do not have permission to update late fees "
      })

    }

  
const lateFees = calculateLateFees(end_date, returnDate, lateFeePerDay);
    const updateQuery = "UPDATE rentals SET late_fee = ?, end_date =? WHERE rental_id = ?";
    db.query(
      updateQuery,
      [lateFees.totalLateFee,returnDate, rental_id],
      (updateErr, updateResults) => {
        if (updateErr) {
          console.error("Error updating late fees:", updateErr);
          return res
            .status(500)
            .json({
              message: "Error updating late fees",
              error: updateErr.message,
            });
        }

        return res.status(200).json({
          message: "Late fees updated successfully",
          rental_id,
          lateFees,
          updatedRental: { ...rental, late_fee: lateFees.totalLateFee,end_date: returnDate },
        });
      }
    );
  });
};


const calculateLateFees = (endDate, returnDate, lateFeePerDay) => {
  const end = new Date(endDate);
  const returned = new Date(returnDate);

  const lateDays =
    returned > end ? Math.ceil((returned - end) / (1000 * 60 * 60 * 24)) : 0;
  const totalLateFee = lateDays * lateFeePerDay;

  return {
    lateDays,
    totalLateFee,
  };
};

const deleteRental = async (req, res) => {
  try {
    const rentalId = req.params.id;
    if (!rentalId) {
      return res.status(400).json({ message: "Missing rental_id parameter" });
    }
    const token =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
      ? req.headers.authorization.split(" ")[1]
      : null;

    if (!token) {
      return res
        .status(401)
        .json({ message: "You are not authorized. Please log in." });
    }

  
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const [user] = await db.promise().query(` Select role FROM users WHERE user_id=?`,[userId]);
    if(user.length===0){
      return res.status(404).json({
        message:"User not found"
      });
    }
    const userRole=user[0].role;
    if(userRole!=="admin"){
      return res.status(403).json({
        message:"Only admins can delete rentals"
      });
    }


    const sql = `DELETE FROM rentals WHERE rental_id= ?`;

    db.query(sql, [rentalId], (error, results) => {
      if (error) {
        console.error("Error deleting rental:", error);
        return res.status(500).json({
          message: "Error deleting rental",
          error: error.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Rental not found" });
      }

      return res.status(200).json({
        message: "Rental deleted successfully",

      });
    });
  } catch (error) {
    console.error("Error deleting rental:", error);
    return res.status(500).json({
      message: "Error deleting rental",
      error: error.message || "An error occurred",
    });
  }
};

module.exports = {
  registerRental,
  getAllRentals,
  updateLateFeesController,
  deleteRental,
  getRentals,
  updateRental,
  acceptOrDenyRental,
  getLateRentals
};
