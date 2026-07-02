const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("Payment Service Running - version 3");
});

app.get("/payments", (req, res) => {
  res.json([
    { id: 201, status: "Success" }
  ]);
});

app.listen(3000, () => {
  console.log("Payment Service running on port 3000");
});