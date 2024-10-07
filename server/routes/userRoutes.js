const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const {
  getAllUsers,
  createNewUser,
  getUserRatings,
  getUser
} = require("../controllers/userController");
const router = express.Router();

// Define routes and link to controller functions
router.get('/users', getAllUsers);
router.post('/users', createNewUser);
router.get('/users/:userId/ratings', getUserRatings); // Retrieves ratings from a specific user
router.get('/users/:userId', getUser) // Retrieves user details

// Add more protected routes here
// router.get("/users/profile", getUserProfile); should we include a method like this?

module.exports = router;
