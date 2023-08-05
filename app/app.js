const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const rateLimit = require("express-rate-limit");
const {
  globalErrorHandler,
  catchAllUndefinedRoutes,
} = require("../middleware/common/errorHandler");
const authRouter = require("../routers/authRouter");
const userRouter = require("../routers/userRouter");
const authMiddleware = require("../middleware/common/authMiddleware");

const app = express();
dotenv.config();

// Middleware
const corsOptions = {
  origin: ["http://example1.com", "http://example2.com", "http://example3.com"],
};

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});

// Apply the rate limiter to all requests
app.use(cors());
app.use(limiter);
app.use(express.json());

// Define routes
app.use("/api/auth/", authRouter);
app.use(authMiddleware);
app.use("/api/users/", userRouter);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
// seperate the user & auth / service , controller, routes
