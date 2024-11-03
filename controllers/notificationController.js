const Notification = require("../models/notificationModel"); 
const db = require("../db_connections/dbConnect");
const jwt = require("jsonwebtoken");

const createNotification = async (req, res) => {
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
    const { user_id, message, status } = req.body;

    const sql = `INSERT INTO notifications (user_id, message, status, created_at) 
                 VALUES (?, ?, ?, ?)`;

    const notificationData = [user_id, message, status, new Date()];

    db.query(sql, notificationData, (error, results) => {
      if (error) {
        console.error("Error registering notification:", error);
        return res.status(500).json({
          message: "Error registering notification",
          error: error.message,
        });
      }

      return res.status(201).json({
        message: "Notification registered successfully",
        notificationlId: results.insertId, 
      });
    });
  } catch (error) {
    console.error("Error registering notification:", error);
    return res.status(500).json({
      message: "Error registering notification",
      error: error.message || "An error occurred",
    });
  }
};

//get the notifications for the registered user
const getUserNotifications = async (req, res) => {
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
    //const userID = req.params.id;

    const sql = `SELECT * FROM  notifications WHERE user_id= ?`;

    db.query(sql, [userId], (error, results) => {
      if (error) {
        console.error("Error retrieving notifications:", error);
        return res.status(500).json({
          message: "Error retrieving notifications",
          error: error.message,
        });
      }
      if (results.length === 0) {
        return res.status(404).json({
          message: "This user doesnt have any notifications yet!",
        });
      }

      return res.status(200).json({
        message: "Notifications retrieved successfully",
        Notification: results, 
      });
    });
  } catch (error) {
    console.error("Error getting notifications:", error);
    return res.status(500).json({
      message: "Error getting notifications",
      error: error.message || "An error occurred",
    });
  }
};
const markAsRead = async (req, res) => {
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
    const notificationId = req.params.id;

    const [user] = await db.promise().query(`SELECT user_id FROM notifications WHERE notification_id=?`,[notificationId]);

    if(user.length===0){
      return res.status(404).json({
        message:"user not found"
      });

    }
    const notificationUser=user[0].user_id;
    if(notificationUser!== userId){
      res.status(403).json({
        message:"This notification is not in your notification list"
      });
    }

    const sql = `UPDATE notifications SET status = ? WHERE notification_id= ?`;

    db.query(sql, ["read", notificationId], (error, results) => {
      if (error) {
        console.error("Error updating status:", error);
        return res.status(500).json({
          message: "Error updating status",
          error: error.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({
          message: "Notification not found or status not changed",
        });
      }

      const selectSql = "SELECT * FROM notifications WHERE notification_id = ?";
      db.query(
        selectSql,
        [notificationId],
        (selectError, notificationResults) => {
          if (selectError) {
            console.error(
              "Error retrieving updated notification:",
              selectError
            );
            return res.status(500).json({
              message: "Error retrieving updated notification",
              error: selectError.message || "An error occurred",
            });
          }


          return res.status(200).json({
            message: "Notification status updated successfully",
            updatedNotification: notificationResults[0], 
          });
        }
      );
    });
  } catch (error) {
    console.error("Error updating notification:", error);
    return res.status(500).json({
      message: "Error updating notification",
      error: error.message || "An error occurred",
    });
  }
};
const deleteNotification = async (req, res) => {
  try {
    
    const notificationId = req.params.id;
    if (!notificationId) {
      return res
        .status(400)
        .json({ message: "Missing notification_id parameter" });
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


  const [user] = await db.promise().query(`SELECT user_id FROM notifications WHERE notification_id=?`,[notificationId]);

  if(user.length===0){
    return res.status(404).json({
      message:"Notification not found"
    });

  }
  const notificationUser=user[0].user_id;
  if(notificationUser!== userId){
    return res.status(403).json({
      message:"This notification is not in your notification list"
    });
  }

    const sql = `DELETE FROM notifications WHERE notification_id= ?`;

    db.query(sql, [notificationId], (error, results) => {
      if (error) {
        console.error("Error deleting notification:", error);
        return res.status(500).json({
          message: "Error deleting notification",
          error: error.message,
        });
      }
      if (results.affectedRows === 0) {
        return res.status(404).json({ message: "Notification not found" });
      }

      return res.status(200).json({
        message: "Notification deleted successfully",

      });
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    return res.status(500).json({
      message: "Error deleting notification",
      error: error.message || "An error occurred",
    });
  }
};
module.exports = {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
};
