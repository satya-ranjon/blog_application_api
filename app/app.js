const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { json } = require("body-parser");

const app = express();
dotenv.config();

// Allow requests only from specified origins
const corsOptions = {
  origin: ["http://example1.com", "http://example2.com", "http://example3.com"],
};

app.use(cors(corsOptions));
app.use(json());

// Define a catch-all route for handling undefined routes
app.use("*", (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} this route`,
  });
});

// Global error handler middleware
app.use((err, req, res, next) => {
  err.status = err.status || "fail";
  err.statusCode = err.statusCode || 500;

  // Send a response with the error details
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
});

module.exports = app;
