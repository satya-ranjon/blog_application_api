/**
 * Catch-all route for handling undefined routes.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 */
const catchAllUndefinedRoutes = (req, res) => {
  res.status(404).json({
    message: `Can't find ${req.originalUrl} this route`,
  });
};

/**
 * Global error handler middleware.
 * @param {Error} err - The error object.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} res - The Express response object.
 * @param {import("express").NextFunction} next - The Express next middleware function.
 */
const globalErrorHandler = (err, req, res, next) => {
  // Set default error status and code if not provided
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  // Log the error (you can customize the logging mechanism as per your needs)
  console.error(err);

  // Send a response with the error details
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = { catchAllUndefinedRoutes, globalErrorHandler };
