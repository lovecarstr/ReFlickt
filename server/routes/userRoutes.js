const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createNewUser,
} = require("../controllers/usersController");
const router = express.Router();

// Public route (no authentication required)
router.post("/createNewUser", createNewUser);

// Protected routes (authentication required)
router.get("/getAllUsers", getAllUsers); // Can add authMiddleware as argument to make protected.

// Add more protected routes here
// router.get("/users/profile", getUserProfile); should we include a method like this?

module.exports = router;
