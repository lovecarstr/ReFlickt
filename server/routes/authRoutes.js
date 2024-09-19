const express = require("express");
const { registerUser } = require("../controllers/registrationController");
const router = express.Router();

router.post("/auth/register", registerUser);

module.exports = router;
