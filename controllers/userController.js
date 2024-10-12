require('dotenv').config()
// const User = require('../models/userSchema.js');
// const ErrorResponse = require('../utils/errorResponse');
const bcrypt = require('bcrypt');
 
const connection = require("../db_connections/dbConnect");
 
const jwt = require('jsonwebtoken');

// async function comparePasswords(plainPassword, hashedPassword) {
//   try {
//       return await bcrypt.compare(plainPassword, hashedPassword);
//   } catch (error) {
//       console.error('Error comparing passwords:', error);
//       return false;
//   }
// }


// exports.signup = async (req, res, next) => {
//   try {
 
//     var sql = "INSERT INTO Users(user_id, first_name, last_name, email, pass, phone_number, address, rating, User_role, create_at) VALUES (1, 'Marah', 'Shakhshir', 'marah@gmail.com', 'password123', '123-456-7890', '123 Main St, Cityville', 4.5, 'renter', CURRENT_TIMESTAMP)";
//     connection.connect(function(err) {
//       if (err) throw err;
//       console.log("Connected!");
//       connection.query(sql, function (err, result) {
//         if (err) throw err;
//         console.log("1 record inserted");
//       });
//     });
  
  
  
 
    
//   } catch (error) {

//       next(error); 
//   }
  
// }
exports.signup = async (req, res, next) => {
  try {
    // Destructure the request body to get user input
    const {user_id, first_name, last_name, email, pass, phone_number, address, rating, User_role } = req.body;
    console.log(user_id);
    console.log(first_name);
    console.log(last_name);
    console.log(email);
    console.log(pass);
    console.log(phone_number);
    console.log(address);
    console.log( rating  );
    console.log(User_role);


    // Parameterized SQL query to prevent SQL injection
    const sql = `INSERT INTO Users(user_id, first_name, last_name, email, pass, phone_number, address, rating, User_role, create_at) 
                    VALUES (${user_id},'${first_name}', '${last_name}','${email}','${pass}','${phone_number}', '${address}', ${rating},'${User_role}', CURRENT_TIMESTAMP)`;
// 2,Taha, Shakhshir, 'taha@gmail.com', 'pass123', '123-456-7890', 'zawata', 3.5, 'renter'
    // Execute the query with provided data
    console.log(sql);
    connection.query(sql,function(err, result)  {
      if (err) {
        // Return error if any issue occurs
        console.log(err);
        return res.status(500).json({ error: 'Database insertion failed' });
      }
      // If successful, respond with success message
      res.status(201).json({ message: "User registered successfully", user_id: result.insertId });
    });

  } catch (err) {
    // Handle errors properly
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
