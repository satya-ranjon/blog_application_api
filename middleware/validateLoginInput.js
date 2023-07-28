const AppError = require("../utils/AppError");
const isValidEmail = require("../utils/emailValidate");

/**
 * Middleware function to validate login input.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} _res - The Express response object (not used here).
 * @param {import("express").NextFunction} next - The Express next middleware function.
 */
function validateLoginInput(req, _res, next) {
  // Extract the email from the request body
  const { email } = req.body;

  // Define the required fields for login input
  const requiredFields = ["email", "password"];

  // Check if required fields are present in the request body
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    // If any required field is missing, return an error.
    return next(
      new AppError(`${missingFields.join(", ")} are required fields.`, 400)
    );
  }

  // Validate the email format using the custom email validation function
  if (!isValidEmail(email)) {
    // If the email format is invalid, return an error.
    return next(new AppError("Invalid email format.", 400));
  }

  // If all validations pass, call the next middleware or route handler.
  next();
}

module.exports = validateLoginInput;
