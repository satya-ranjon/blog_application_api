const uploadPicture = require("../middleware/uploadPictureMiddleware");
const User = require("../models/userModel");
const userService = require("../services/userService");
const AppError = require("../utils/AppError");
const fileRemover = require("../utils/fileRemover");
const fs = require("fs");
const path = require("path");

/**
 * Get the user profile based on the authenticated user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const userProfile = async (req, res, next) => {
  try {
    // Fetch the user profile data based on the authenticated user ID
    const userProfileData = await userService.userProfile(req.user._id);

    // Respond with the user profile data
    res.status(200).json(userProfileData);
  } catch (err) {
    // Pass the error to the next error-handling middleware
    next(err);
  }
};

/**
 * Handles the profile update for a user.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 * @returns {void}
 */
const profileUpdate = async (req, res, next) => {
  try {
    // The result 'updateInfo' should contain the updated user information.
    const updateInfo = await userService.profileUpdate(req.user._id, req.body);

    // Respond with the user update profile data
    res.status(200).json(updateInfo);
  } catch (err) {
    // Pass the error to the next error-handling middleware
    next(err);
  }
};

/**
 * Updates the user's password.
 * @param {Object} req - Express request object.
 * @param {Object} res - Express response object.
 * @param {Function} next - Express next middleware function.
 */
const passwordUpdate = async (req, res, next) => {
  try {
    // Call the userService.passwordUpdate function to update the user's password
    const message = await userService.passwordUpdate(
      req.user._id,
      req.body.newPassword,
      req.body.oldPassword
    );

    // Respond with a success message after successfully updating the password
    res.status(200).json(message);
  } catch (err) {
    // Pass any errors that occur during the process to the next error-handling middleware
    next(err);
  }
};

// The updated function with improvements
const updateProfilePicture = async (req, res, next) => {
  try {
    // Use the multer single middleware to handle the file upload
    uploadPicture.single("profilePicture")(req, res, async (err) => {
      if (err) {
        // If there's an error during file upload, pass it to the error handling middleware
        return next(
          new AppError("An unknown error occurred when uploading", 401)
        );
      }

      // If the request contains a file (picture was uploaded)
      if (req.file) {
        const user = await User.findById(req.user._id);
        const filePath = path.join("./uploads", user.avatar);
        if (user.avatar) {
          fs.unlink(filePath, (err) => {
            console.log(err);
          });
        }

        user.avatar = req.file.filename;
        const updatedUser = await user.save();

        // Send the updated user object as the response
        res.json(updatedUser);
      } else {
        // If the request does not contain a file (no picture was uploaded)
        // Fetch the user from the database
        let updatedUser = await User.findById(req.user._id);

        // Get the current filename of the avatar (profile picture)
        const filename = updatedUser.avatar;

        // Clear the user's avatar field in the database
        updatedUser.avatar = "";
        await updatedUser.save();

        // Remove the previous profile picture from storage
        fileRemover(filename);

        // Send the updated user object as the response
        res.json(updatedUser);
      }
    });
  } catch (err) {
    // Handle any unexpected errors and pass them to the error handling middleware
    next(err);
  }
};

module.exports = {
  userProfile,
  profileUpdate,
  passwordUpdate,
  updateProfilePicture,
};

//C:\Users\k1598\Desktop\Backend-project-node-express\blog_application_api\uploads
//C:\Users\k1598\Desktop\Backend-project-node-express\uploads\code-1691221375999-345573526.png
