const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const router = express.Router();

// UNCATEGORIZED
router.get("/users/profile", authMiddleware, userController.getUserProfile); // Gets current authorized (logged in) user 
router.patch('/users/:userId/tokens', userController.refillUserTokens); // Refills user tokens if enough time has passed since last refill
router.get('/users/:userId/matches/window', userController.checkWatchWindow);// Checks the remaining time of the 48h watch window for a user's current match

// GET (collection)
router.get('/users', userController.getAllUsers);

// GET (individual)
// router.get('/users/:userId', getUser);

// GET (relationship, example: /cars/:car_id/drivers)
router.get('/users/:userId/tokens', userController.getUserTokens); // Returns remaining vote tokens for a user

// DELETE (double relationship, example: /cars/:car_id/drivers/:driver_id)
router.delete('/users/:userId/movies/:movieId', userController.deleteWatchedMovieFromUser); // Delete a movie from a user's list of watched movies 

module.exports = router;
