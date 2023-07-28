/**
 * Checks if the provided email address is valid based on a regular expression.
 * @param {string} email - The email address to be validated.
 * @returns {boolean} True if the email address is valid, false otherwise.
 */
function isValidEmail(email) {
  // Regular expression to validate the email format
  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  // Test the provided email against the regular expression
  return emailRegex.test(email);
}

module.exports = isValidEmail;
