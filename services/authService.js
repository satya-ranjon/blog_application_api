const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const hashPassword = async (password) => {
  const saltRounds = 10;
  return await bcrypt.hash(password, saltRounds);
};

const passwordCompere = async (password, hashPassword) => {
  return await bcrypt.compare(password, hashPassword);
};

const generateAuthToken = (userId) => {
  const token = jwt.sign({ _id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30h",
  });
  return token;
};

module.exports = { generateAuthToken, hashPassword, passwordCompere };
