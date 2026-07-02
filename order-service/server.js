const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Order Service Running");
});

app.get("/orders", (req, res) => {
  res.json([
    { id: 101, status: "Placed" }
  ]);
});

app.listen(3000, () => {
  console.log("Order Service running on port 3000");
});