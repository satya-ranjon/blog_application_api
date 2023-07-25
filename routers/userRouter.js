const express = require("express");
const { registerUser } = require("../controllers/userController");
const validateRegisterInput = require("../middleware/validateRegisterInput ");
const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);

module.exports = router;
