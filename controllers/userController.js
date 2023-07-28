const userService = require("../services/userService");

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

module.exports = { registerUser, loginUser };
