const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

/**
 * Hashes the provided password using bcrypt.
 * @param {string} password - The password to be hashed.
 * @returns {Promise<string>} A promise that resolves to the hashed password.
 */
const hashPassword = async (password) => {
  // Define the number of salt rounds for bcrypt (10 is a common value)
  const saltRounds = 10;

  // Use bcrypt to hash the password with the specified salt rounds
  return await bcrypt.hash(password, saltRounds);
};

/**
 * Compares the provided password with the hashed password using bcrypt.
 * @param {string} password - The password to be compared.
 * @param {string} hashedPassword - The hashed password to be compared against.
 * @returns {Promise<boolean>} A promise that resolves to true if the password matches the hashed password, false otherwise.
 */
const passwordCompare = async (password, hashedPassword) => {
  // Use bcrypt to compare the provided password with the hashed password
  return await bcrypt.compare(password, hashedPassword);
};

/**
 * Generates an authentication token using JSON Web Token (JWT).
 * @param {string} userId - The user ID to be encoded in the token.
 * @returns {string} The generated authentication token.
 */
const generateAuthToken = (userId) => {
  // Create a JWT token containing the user ID, signed with the JWT_SECRET and set to expire in 30 hours
  const expirationTime = Math.floor(Date.now() / 1000) + 60;
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: expirationTime,
  });

  return token;
};

module.exports = { generateAuthToken, hashPassword, passwordCompare };
