const express = require("express"); // to import express
const path = require("path");
const userRouter = require("./routes/userRouter");
const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`)); // to listen on the port for any api

const connection = require("./db_connections/dbConnect");

app.use("/rentItOut/users", userRouter);
