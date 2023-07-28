const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const removeRsUnDataFormUser = require("../utils/removeRsUnDataFormUser");
const {
  generateAuthToken,
  hashPassword,
  passwordCompare,
} = require("./authService");

/**
 * Registers a new user with the provided name, email, and password.
 * @param {string} name - The name of the user to be registered.
 * @param {string} email - The email of the user to be registered.
 * @param {string} password - The password of the user to be registered.
 * @returns {Object} An object containing the savedUser and the JWT token.
 * @throws {AppError} If the email is already registered or if an error occurs during registration.
 */
const registerUser = async (name, email, password) => {
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      throw new AppError(
        "Email already registered. Please use a different email.",
        400
      );
    }

    // Hashing the password
    const hashedPassword = await hashPassword(password);

    // Create a new user object
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();

    // Generate and attach the JWT token to the user object
    const token = generateAuthToken(savedUser._id);

    // Return the user & generated token
    return { user: removeRsUnDataFormUser(savedUser), token };
  } catch (error) {
    // The catch block will handle any other errors during login
    if (error instanceof AppError) {
      // Re-throw AppError instances (such as "User Not Found" or "Invalid email or password" errors)
      throw error;
    } else {
      // If there's any other error during registration, throw a generic AppError
      throw new AppError(
        "Failed to register user. Please try again later.",
        500
      );
    }
  }
};

/**
 * Logs in the user with the provided email and password.
 * @param {string} email - The email of the user to be logged in.
 * @param {string} password - The password of the user to be logged in.
 * @returns {Object} An object containing the user and the JWT token.
 * @throws {AppError} If the user is not found, the password is invalid, or if an error occurs during login.
 */
const loginUser = async (email, password) => {
  try {
    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError(
        "User not found. Please check your email or register for a new account.",
        404
      );
    }

    // Compare the provided password with the stored hashed password
    const isPasswordValid = await passwordCompare(password, user.password);

    if (!isPasswordValid) {
      throw new AppError(
        "Invalid email or password. Please check your credentials and try again.",
        401
      );
    }

    // Generate an authentication token for the user
    const token = generateAuthToken(user._id);

    // Return the user & generated token
    return { user: removeRsUnDataFormUser(user), token };
  } catch (error) {
    // The catch block will handle any other errors during login
    if (error instanceof AppError) {
      // Re-throw AppError instances (such as "User Not Found" or "Invalid email or password" errors)
      throw error;
    } else {
      // If there's any other error during login, throw a generic AppError
      throw new AppError("Failed to login. Please try again later.", 500);
    }
  }
};

module.exports = { registerUser, loginUser };
