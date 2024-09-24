const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createNewUser,
} = require("../controllers/usersController");
const router = express.Router();

// Public route (no authentication required)
router.post("/createNewUser", createNewUser);

// Apply authMiddleware to all routes defined after this point
router.use(authMiddleware);

// Protected routes (authentication required)
router.get("/getAllUsers", getAllUsers);

// Add more protected routes here
// router.get("/users/profile", getUserProfile); should we include a method like this?

module.exports = router;
