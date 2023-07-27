const validator = require("validator");
const AppError = require("../utils/AppError");

function validateLoginInput(req, _res, next) {
  const { email } = req.body;

  const requiredFields = ["email", "password"];

  // Check if required fields are present
  const missingFields = requiredFields.filter((field) => !req.body[field]);
  if (missingFields.length > 0) {
    return next(
      new AppError(`${missingFields.join(", ")} are required fields`, 400)
    );
  }

  if (!validator.isEmail(email)) {
    return new AppError("Invalid email format", 400);
  }

  next();
}

module.exports = validateLoginInput;
