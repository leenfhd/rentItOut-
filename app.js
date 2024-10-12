const express = require("express"); // to import express
const app = express();
const cors=require("cors");
app.use(cors({ origin: true }));
const PORT = 8087;
app.use(express.json());
app.listen(PORT, () => console.log(`running on http://localhost:${PORT}`)); // to listen on the port for any api

const connection = require("./db_connections/dbConnect");

const MessageRoute=require('./Routes/messageRoutes.js');
const rentalRoutes=require('./Routes/rentalRoutes.js');
const userRoutes=require('./Routes/userRoutes.js');
const ReviewRoutes=require('./Routes/reviewRoutes.js');

app.use(MessageRoute);
app.use(rentalRoutes);
app.use(userRoutes);
app.use(ReviewRoutes);

// app.use('/api', reviewRoutes); // Adjust the base path as needed

app.get("/test", (req, res) => {
  res.status(200).send({
    name: "ASW project",
    message: "Helloo",
  });
});

app.post("/test:name", (req, res) => {
  const { name } = req.params;
  const { data } = req.body;
  /*if (!data) {
    res.status(404).send({ message: "data not found" });
  }*/

  res.status(200).send({ message: "sucess" });
});

//test