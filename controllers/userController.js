const User = require("../models/userModel");
const { findById } = require("../models/userModel");
const userService = require("../services/userService");

/**
 * Register a new user.
 * @param {Object} req - Express request object containing user data in the request body.
 * @param {Object} res - Express response object to send the registration response.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {void}
 */
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // Call the userService.registerUser function to handle user registration
    const newUser = await userService.registerUser(name, email, password);

    // Send a success response with the newly registered user data
    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
      data: newUser,
    });
  } catch (err) {
    // Pass the error to the next middleware for centralized error handling
    next(err);
  }
};

/**
 * Log in an existing user.
 * @param {Object} req - Express request object containing user login data in the request body.
 * @param {Object} res - Express response object to send the login response.
 * @param {Function} next - Express next middleware function for error handling.
 * @returns {void}
 */
const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Call the userService.loginUser function to handle user login
    const user = await userService.loginUser(email, password);

    // Send a success response with the generated token
    res.status(200).json({
      status: "success",
      message: "User logged in successfully!",
      ...user,
    });
  } catch (err) {
    // Pass the error to the next middleware for centralized error handling
    next(err);
  }
};

/**
 * Get the user profile based on the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const userProfile = async (req, res, next) => {
  try {
    // Fetch the user profile data based on the authenticated user ID
    const userProfileData = await userService.userProfile(req.user._id);

    // Respond with the user profile data
    res.status(200).json(userProfileData);
  } catch (err) {
    // Pass the error to the next error-handling middleware
    next(err);
  }
};

/**
 * Handles the profile update for a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const profileUpdate = async (req, res, next) => {
  try {
    // The result 'updateInfo' should contain the updated user information.
    const updateInfo = await userService.profileUpdate(req.user._id, req.body);

    // Respond with the user update profile data
    res.status(200).json(updateInfo);
  } catch (err) {
    // Pass the error to the next error-handling middleware
    next(err);
  }
};

module.exports = { registerUser, loginUser, userProfile, profileUpdate };
