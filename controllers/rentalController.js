const { request } = require('express'); 
const ErrorResponse = require('../utils/errorResponse.js');
const bcrypt = require('bcrypt');
var dt=require('../date.js');
 
const jwt = require('jsonwebtoken');
const connection = require('../db_connections/dbConnect.js');




exports.viewUserOFItem = async (req, res, next) => {
  try {
    const { id } = req.params;

     const query = `SELECT first_name ,last_name, email, phone_number,address,rating,start_date,end_date,late_fee,status_rental,total_price
     FROM Users u JOIN Rentals r ON u.user_id = r.renter_id OR u.user_id = r.owner_id WHERE r.rental_id = ?;`;

    
   
    connection.query(query, [id], (err, result) => {
      if (err) {
 
        return res.status(500).json({ error: 'Database query failed' });
      }
     
      res.status(200).json(result);
    });
  } catch (err) { 
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
 