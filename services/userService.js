const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const { generateAuthToken, hashPassword } = require("./authService");

const registerUser = async (name, email, password) => {
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Hashing the password
    const hashingPassword = await hashPassword(password);

    // Create a new
    const newUser = new User({ name, email, password: hashingPassword });
    const savedUser = await newUser.save();

    // Generate and attach the JWT token to the user object
    const token = generateAuthToken(savedUser._id);

    // Remove the password field from the returned user object
    delete savedUser.password;

    return { savedUser, token };
  } catch (error) {
    throw new AppError("Failed to register user", 500);
  }
};

module.exports = { registerUser };
