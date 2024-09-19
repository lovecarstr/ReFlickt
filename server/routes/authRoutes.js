const express = require("express");
const { registerUser } = require("../controllers/registrationController");
const { logInUser } = require("../controllers/loginController");
const router = express.Router();

router.post("/auth/register", registerUser);
router.post("/auth/login", logInUser);

module.exports = router;
