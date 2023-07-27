const User = require("../models/userModel");
const AppError = require("../utils/AppError");
const {
  generateAuthToken,
  hashPassword,
  passwordCompere,
} = require("./authService");

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

const loginUser = async (email, password) => {
  try {
    // Find the user with the provided email in the database
    const user = await User.findOne({ email });

    if (!user) {
      throw new AppError("User Not Found", 404);
    }

    // Compare the provided password with the stored hashed password
    const isPassword = await passwordCompere(password, user.password);

    // If the password does not match
    if (!isPassword) {
      throw new AppError("Invalid email or password", 401);
    }

    // If email and password match, generate an authentication token for the user
    const token = generateAuthToken(user._id);

    // Return the generated token
    return token;
  } catch (error) {
    throw new AppError("Failed to login", 500);
  }
};

module.exports = { registerUser, loginUser };
