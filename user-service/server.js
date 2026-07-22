const express = require("express");

const app = express();

// Middleware to log every request
app.use((req, res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - ${req.ip}`
  );
  next();
});

app.get("/", (req, res) => {
  console.log("Serving home page");
  res.send("User Service Running");
});

app.get("/health", (req, res) => {
  console.log("Health check requested");
  res.status(200).json({
    status: "UP",
  });
});

// Handle 404 requests
app.use((req, res) => {
  console.log(`404 Not Found: ${req.originalUrl}`);
  res.status(404).json({
    error: "Not Found",
  });
});

app.listen(3000, () => {
  console.log("User Service running on port 3000");
});