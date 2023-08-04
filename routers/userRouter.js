const express = require("express");
const {
  registerUser,
  loginUser,
  userProfile,
  profileUpdate,
} = require("../controllers/userController");
const validateRegisterInput = require("../middleware/validateRegisterInput ");
const validateLoginInput = require("../middleware/validateLoginInput");
const isAuthenticated = require("../middleware/common/authMiddleware");
const router = express.Router();

// Route for user registration
router.post("/register", validateRegisterInput, registerUser);

// Route for user login
router.post("/login", validateLoginInput, loginUser);

// Route for user profile
router.get("/profile", isAuthenticated, userProfile);

// Route for user profileUpdate
router.patch("/update-profile", isAuthenticated, profileUpdate);

module.exports = router;
