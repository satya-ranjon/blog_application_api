const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {
  globalErrorHandler,
  catchAllUndefinedRoutes,
} = require("../middleware/common/errorHandler");
const userRouter = require("../routers/userRouter");

const app = express();
dotenv.config();

// Allow requests only from specified origins
const corsOptions = {
  origin: ["http://example1.com", "http://example2.com", "http://example3.com"],
};

app.use(cors(corsOptions));

// Rate limiting middleware with options
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(limiter);

app.use(express.json());

// Define routes
app.use("/api/users/", userRouter);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
