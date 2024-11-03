const express = require("express"); // to import express
const app = express();
const cors=require("cors");
app.use(cors({ origin: true }));
const PORT = 8087;
app.use(express.json());
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`)); // to listen on the port for any api


const ReviewRoutes=require('./Routes/reviewRoutes.js');
const MessageRoute=require('./Routes/messageRoutes.js');
app.use("/message/",MessageRoute);
app.use("/review/",ReviewRoutes);














const connection = require("./db_connections/dbConnect");
const rentalRoutes=require('./Routes/rentalRoutes.js');
const userRoutes=require('./Routes/userRoutes.js');
app.use(rentalRoutes);
app.use(userRoutes);


