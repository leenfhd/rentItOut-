const express = require("express"); // to import express
const path = require("path");
const userRouter = require("./routes/userRouter");
const delvireyRouter = require("./routes/delvireyRouter");
const insuranceRouter = require("./routes/insuranceRouter");
const itemRouter = require("./routes/itemRouter"); // Import the item router
const wishlistRouter = require("./routes/wishlistRouter");
const couponRouter = require("./routes/couponRouter");
const notificationRouter = require("./routes/notificationRouter");
const rentalRouter = require("./routes/rentalRouter");
const ReviewRoutes = require("./routes/reviewRoutes.js");
const MessageRoute = require("./routes/messageRoutes.js");
const paymentRouter = require("./routes/paymentRoutes");
const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`)); // to listen on the port for any api
const connection = require("./db_connections/dbConnect");
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*"); // or specify your Flutter app's origin
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});
const cors = require("cors");
app.use(cors());
app.use("/rentItOut/users", userRouter);
app.use("/rentItOut/delivery", delvireyRouter);
app.use("/rentItOut/insurance", insuranceRouter);
app.use("/rentItOut/items", itemRouter);
app.use("/rentItOut/wishlists", wishlistRouter);
app.use("/rentItOut/coupons", couponRouter);
app.use("/rentItOut/notifications", notificationRouter);
app.use("/rentItOut/rentals", rentalRouter);
app.use("/rentItOut/message/", MessageRoute);
app.use("/rentItOut/review/", ReviewRoutes);
app.use("/rentItOut/payments", paymentRouter); // Register the payment routes
