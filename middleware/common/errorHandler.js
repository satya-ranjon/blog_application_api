// Define a catch-all route for handling undefined routes
const catchAllUndefinedRoutes = (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} this route`,
  });
};

// Global error handler middleware
const globalErrorHandler = (err, req, res, next) => {
  err.status = err.status || "fail";
  err.statusCode = err.statusCode || 500;

  // Send a response with the error details
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { catchAllUndefinedRoutes, globalErrorHandler };
