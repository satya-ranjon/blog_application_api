const { verify } = require("jsonwebtoken");
const User = require("../../models/userModel");
const AppError = require("../utils/AppError");

/**
 * Middleware function to authenticate user based on JWT token in the Authorization header.
 * @param {import("express").Request} req - The Express request object.
 * @param {import("express").Response} _res - The Express response object (not used here).
 * @param {import("express").NextFunction} next - The Express next middleware function.
 */
const isAuthenticated = async (req, _res, next) => {
  // Check if the Authorization header is present and starts with "Bearer "
  const authHeader =
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer ");

  if (!authHeader) {
    // If Authorization header is missing or not in the right format, return an error.
    return next(
      new AppError("Authorization header missing or in the wrong format.", 401)
    );
  }

  try {
    // Extract the token from the Authorization header
    const token = authHeader.split(" ")[1];

    // Verify the token using the JWT_SECRET from the environment variables
    const { id, exp } = verify(token, process.env.JWT_SECRET);

    if (!id) {
      // If the token does not contain a valid user id, return an error.
      return next(new AppError("Invalid credentials.", 403));
    }

    if (exp && Date.now() >= exp * 1000) {
      // If the token has an expiration time and it's expired, return an error.
      return next(new AppError("Token has expired.", 401));
    }

    // Retrieve the user from the database based on the user id from the token
    const user = await User.findById(id).select("-password");

    if (!user) {
      // If the user with the provided id is not found, return an error.
      return next(new AppError("User not found.", 404));
    }

    // Attach the user object to the request for further use in the route handler
    req.user = user;

    // Call the next middleware or route handler
    next();
  } catch (err) {
    // If any error occurs during the verification or database query, return an error.
    return next(
      new AppError("Something went wrong. Please try again later.", 500)
    );
  }
};

module.exports = isAuthenticated;
