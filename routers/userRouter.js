const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const validateRegisterInput = require("../middleware/validateRegisterInput ");
const validateLoginInput = require("../middleware/validateLoginInput");
const router = express.Router();

// Route for user registration
router.post("/register", validateRegisterInput, registerUser);

// Route for user login
router.post("/login", validateLoginInput, loginUser);

module.exports = router;
