/**
 * Custom error class to create specific instances of errors with custom properties.
 * Create a new instance of AppError.
 * @param {string} message - The error message.
 * @param {number} statusCode - The HTTP status code of the error response.
 */

class AppError extends Error {
  constructor(message, statusCode) {
    // Call the Error constructor with the provided message
    super(message);

    // Set the HTTP status code of the error response
    this.statusCode = statusCode;

    // Set the status based on the first digit of the status code
    this.status = `${statusCode}`.startsWith("4") ? "fail" : "error";

    // Indicates if this error is expected and should be considered operational
    this.isOperational = true;

    // Capture the stack trace, excluding the constructor call, for this error instance
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
