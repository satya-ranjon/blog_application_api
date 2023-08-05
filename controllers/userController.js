const userService = require("../services/userService");

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

module.exports = {
  userProfile,
  profileUpdate,
  passwordUpdate,
};
