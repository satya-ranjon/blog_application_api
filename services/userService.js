const bcrypt = require("bcrypt");
const User = require("../models/userModel");
const AppError = require("../utils/AppError");

const registerUser = async (name, email, password) => {
  try {
    // Check if the email is already registered
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError("Email already registered", 400);
    }
    // Hash the password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user with the hashed password
    const newUser = new User({ name, email, password: hashedPassword });
    const savedUser = await newUser.save();
    delete savedUser.password;

    return savedUser;
  } catch (error) {
    throw new AppError("Failed to register user", 500);
  }
};

module.exports = { registerUser };
