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

/**
 * Fetches user profile by ID.
 * @param {string} _id - The ID of the user to fetch the profile for.
 * @returns {Promise<Object>} The user profile object without sensitive data.
 * @throws {AppError} If the user is not found, throws a custom AppError with a 404 status.
 * @throws {AppError} If any other error occurs, throws a generic AppError with a 500 status.
 */
const userProfile = async (_id) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(_id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }
    // If the user is found, remove sensitive data before returning the user profile
    return removeRsUnDataFormUser(user);
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Updates the user's profile information.
 * @param {string} id - The ID of the user to update.
 * @param {Object} data - The data containing the fields to update in the user's profile.
 * @returns {Promise<Object>} A Promise that resolves to the updated user information.
 * @throws {AppError} If the user with the provided ID is not found, an error with a 404 status will be thrown.
 * @throws {AppError} If any other error occurs during the process, a generic error with a 500 status will be thrown.
 */
const profileUpdate = async (id, data) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }

    // Update user properties with the provided data or keep the existing value if data is not provided
    user.name = data.name || user.name;
    user.email = data.email || user.email;

    // Save the updated user information back to the database
    const updateInfo = await user.save();

    // Remove sensitive and unnecessary data from the user before returning
    return removeRsUnDataFormUser(updateInfo);
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

/**
 * Updates the user's password.
 * @param {string} id - The ID of the user to update the password for.
 * @param {string} newPassword - The new password to set for the user.
 * @param {string} oldPassword - The old password for validation purposes.
 * @returns {Promise<Object>} A Promise that resolves to an object with a success message.
 * @throws {AppError} If the user with the provided ID is not found, an error with a 404 status will be thrown.
 * @throws {AppError} If the provided credentials are invalid (e.g., empty passwords or newPassword length less than 6 characters), an error with a 401 status will be thrown.
 * @throws {AppError} If the provided old password does not match the user's current password, an error with a 401 status will be thrown.
 * @throws {AppError} If any other error occurs during the password update process, a generic error with a 500 status will be thrown.
 */
const passwordUpdate = async (id, newPassword, oldPassword) => {
  try {
    // Find the user in the database by the provided ID
    const user = await User.findById(id);
    if (!user) {
      // If the user is not found, throw a custom AppError with a 404 status
      throw new AppError(
        "User not found. Please check the provided ID or register for a new account.",
        404
      );
    }

    // Check if provided credentials are valid (non-empty new and old passwords, and newPassword length >= 6)
    if (!newPassword || !oldPassword || !(newPassword.length >= 6)) {
      throw new AppError(
        "Invalid credentials. Please check your credentials and try again.",
        401
      );
    }

    // Compare the provided password with the stored hashed password for validation
    const isPasswordValid = await passwordCompare(oldPassword, user.password);

    if (!isPasswordValid) {
      // If the old password does not match the user's current password, throw a custom AppError with a 401 status
      throw new AppError(
        "Invalid password. Please check your credentials and try again.",
        401
      );
    }

    // Hash the new password before saving it to the database
    const hashedPassword = await hashPassword(newPassword);

    user.password = hashedPassword || user.password;

    // Save the updated user information back to the database
    await user.save();

    // Return an object with a success message
    return { message: "Password Update Successfully" };
  } catch (error) {
    // Handle any errors that occur during the process
    if (error instanceof AppError) {
      // If the error is already an instance of AppError, rethrow it
      throw error;
    } else {
      // If the error is not an instance of AppError, throw a generic AppError with a 500 status
      throw new AppError("Something went wrong. Please try again later.", 500);
    }
  }
};

module.exports = {
  registerUser,
  loginUser,
  userProfile,
  profileUpdate,
  passwordUpdate,
};
