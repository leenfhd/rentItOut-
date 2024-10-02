const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "123456",
  database: "rentItOut",
});

// Connect to MySQL
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
    return;
  }
  console.log("Connected to MySQL!");
});

// // Close the connection (optional, can be done when needed)
// connection.end((err) => {
//   if (err) {
//     console.error("Error closing the connection:", err);
//     return;
//   }
//   console.log("Connection closed.");
// });
module.exports = connection;
