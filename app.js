const express = require("express"); // Import express
const itemRouter = require("./routes/itemRouter"); // Import the item router
const connection = require("./db_connections/dbConnect"); // Import the DB connection
const wishlistRouter = require("./routes/wishlistRouter");
const couponRouter = require("./routes/couponRouter");

const app = express();
const PORT = 8080;

app.use(express.json()); // Middleware to parse JSON

// Route for item-related operations
app.use("/rentItOut/items", itemRouter);
app.use("/rentItOut/wishlists", wishlistRouter);
app.use("/rentItOut/coupons", couponRouter);

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
