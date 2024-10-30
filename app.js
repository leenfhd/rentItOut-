const express = require("express"); // to import express
const path = require("path");
const userRouter = require("./routes/userRouter");
const delvireyRouter = require("./routes/delvireyRouter");
const insuranceRouter = require("./routes/insuranceRouter");
const itemRouter = require("./routes/itemRouter"); // Import the item router
const wishlistRouter = require("./routes/wishlistRouter");
const couponRouter = require("./routes/couponRouter");
const connection = require("./db_connections/dbConnect"); // Import the DB connection
const loginRoutes = require("./routes/loginRoutes"); // Adjust the path as needed
const cartRoutes = require('./routes/cartRoutes');


const app = express();
const PORT = 8080;
const cors = require('cors');
app.use(cors());

app.use(express.json()); // Middleware to parse JSON

app.use("/rentItOut/users", userRouter);
app.use("/rentItOut/userss", loginRoutes);

app.use("/rentItOut/delivery", delvireyRouter);
app.use("/rentItOut/insurance", insuranceRouter);
app.use("/rentItOut/items", itemRouter);
app.use("/rentItOut/wishlists", wishlistRouter);
app.use("/rentItOut/coupons", couponRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/rentItOut/rent-cart', cartRoutes);


// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));