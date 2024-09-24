const express = require("express");
const { registerUser } = require("../controllers/registrationController");
const { logInUser } = require("../controllers/loginController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);

module.exports = router;
