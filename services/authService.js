const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const removeRsUnDataFormUser = require("../utils/removeRsUnDataFormUser");

/**
 * Hashes the provided password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hashPassword = async (password) => {
  // Define the number of salt rounds for bcrypt (10 is a common value)
  const saltRounds = 10;

  // Use bcrypt to hash the password with the specified salt rounds
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares the provided password with the hashed password using bcrypt.
 * @param {string} password - The password to be compared.
 * @param {string} hashedPassword - The hashed password to be compared against.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hashed password, false otherwise.
 */
const passwordCompare = async (password, hashedPassword) => {
  // Use bcrypt to compare the provided password with the hashed password
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generates an authentication token using JSON Web Token (JWT).
 * @param {string} userId - The user ID to be encoded in the token.
 * @returns {string} The generated authentication token.
 */
const generateAuthToken = (userId) => {
  // Create a JWT token containing the user ID, signed with the JWT_SECRET and set to expire in 30 hours
  const expirationTime = Math.floor(Date.now() / 1000) + 60;
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: expirationTime,
  });

  return token;
};

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

module.exports = {
  generateAuthToken,
  hashPassword,
  passwordCompare,
  registerUser,
  loginUser,
};
