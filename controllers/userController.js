const userService = require("../services/userService");
const validator = require("validator");

// Controller function to handle user registration
const registerUser = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const result = await userService.registerUser(name, email, password);

    res.status(201).json({
      status: "success",
      message: "User registered successfully!",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = { registerUser };
