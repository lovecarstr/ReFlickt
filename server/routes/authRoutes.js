const express = require("express");
const { registerUser } = require("../controllers/registrationController");
const { logInUser } = require("../controllers/loginController");
const {
  requestPasswordReset,
  resetPassword,
} = require("../controllers/passwordController"); // Import password reset functions
const { changePassword } = require("../controllers/passwordController");
const router = express.Router();

router.post("/register", registerUser);
router.post("/login", logInUser);
router.post("/request-password-reset", requestPasswordReset); // Add route for requesting password reset
router.post("/reset-password/:token", resetPassword); // Add route for resetting password

// **Protected Route for Changing Password**
router.post("/change-password", authMiddleware, changePassword);

module.exports = router;
