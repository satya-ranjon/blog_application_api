const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
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
app.use(express.json());

// Define routes
app.use("/api/users/", userRouter);

// handling undefined routes
app.use(catchAllUndefinedRoutes);

// Global error handler
app.use(globalErrorHandler);

module.exports = app;
