const express = require("express");
const {
  userProfile,
  profileUpdate,
  passwordUpdate,
  updateProfilePicture,
} = require("../controllers/userController");

const router = express.Router();

// Route for user profile
router.get("/profile", userProfile);

// Route for user profileUpdate
router.patch("/update-profile", profileUpdate);

// Route for user password update
router.patch("/update-password", passwordUpdate);

// Route for user profile picture update
router.patch("/update-picture", updateProfilePicture);

module.exports = router;
