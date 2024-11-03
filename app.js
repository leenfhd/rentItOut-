const express = require("express");
const path = require("path");
const userRouter = require("./routes/userRouter");
const delvireyRouter = require("./routes/delvireyRouter");
const insuranceRouter = require("./routes/insuranceRouter");
const itemRouter = require("./routes/itemRouter");
const wishlistRouter = require("./routes/wishlistRouter");
const couponRouter = require("./routes/couponRouter");
const connection = require("./db_connections/dbConnect");
const loginRoutes = require("./routes/loginRoutes");
const cartRoutes = require('./routes/cartRoutes');
const paymentRouter = require("./routes/paymentRoutes"); // Import the payment routes
//const zegoRouter = require("./routes/zegoRouter"); // Import the payment routes
// Load environment variables

const app = express();
const PORT = 8080;
const cors = require('cors');
app.use(cors());
app.use(express.json());
require("dotenv").config(); 
 
app.use("/rentItOut/users", userRouter);
app.use("/rentItOut/video", zegoRouter);
app.use("/rentItOut/userss", loginRoutes);
app.use("/rentItOut/delivery", delvireyRouter);
app.use("/rentItOut/insurance", insuranceRouter);
app.use("/rentItOut/items", itemRouter);
app.use("/rentItOut/wishlists", wishlistRouter);
app.use("/rentItOut/coupons", couponRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/rentItOut/rent-cart', cartRoutes);
app.use("/rentItOut/payments", paymentRouter); // Register the payment routes

// Start the server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
