const express = require("express");
const { registerUser, loginUser } = require("../controllers/userController");
const validateRegisterInput = require("../middleware/validateRegisterInput ");
const validateLoginInput = require("../middleware/validateLoginInput");
const router = express.Router();

router.post("/register", validateRegisterInput, registerUser);
router.post("/login", validateLoginInput, loginUser);

module.exports = router;
