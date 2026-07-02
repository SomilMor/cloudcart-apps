const express = require("express");

const app = express();

app.get("/", (req, res) => {
  res.send("User Service Running");
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "UP"
  });
});

app.listen(3000, () => {
  console.log("User Service running on port 3000");
});