const express = require("express"); // to import express
const app = express();
const PORT = 8080;
app.use(express.json());
app.listen(PORT, () => console.log("running on http://localhost:${PORT}")); // to listen on the port for any api

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
