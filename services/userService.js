const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const registerUser = async (name, email, password) => {
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }

    // Create a new
    const newUser = new User({ name, email, password });
    const savedUser = await newUser.save();
    delete savedUser.password;

    return savedUser;
  } catch (error) {
    throw new AppError("Failed to register user", 500);
  }
};

module.exports = { registerUser };
