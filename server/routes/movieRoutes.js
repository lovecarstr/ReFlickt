const express = require("express");
const movieController = require("../controllers/movieController");
const router = express.Router();

// UNCATEGORIZED
router.get("/movies/search", movieController.searchMovie); // Search the database for a movie based on title
router.get("/movies/random", movieController.getRandomMovie); // Retrieves a random movie from open matches or movie entries
router.get("/movies/:movieId/details", movieController.getMovieDetails);
router.get("/movies/:movieId/basic", movieController.getMovieBasicInfo);
router.get("/users/:userId/matches/window", movieController.checkWatchWindow); // Checks the remaining time of the 48h watch window for a user
router.patch(
  "/users/:userId/matches/:matchId",
  movieController.updateCurrentUserMatch
); // Updates the currentMatch for a user
router.patch("/users/:userId/tokens", movieController.refillUserTokens); // Refills user tokens if enough time has passed since last refill
router.patch("/movies/matches/decline", movieController.declineMatch); // User declines a match with a random movie

// POST (collection)
router.post("/movies", movieController.addMovieEntry); // Spends 1-5 tokens to vote for a movie and add it as an entry to the pool
router.post("/movies/matches", movieController.createNewMatch); // Creates a new match with a single user and a movie entry
router.post("/movies/ratings", movieController.rateMovie); // Creates a rating for a movie from a specific user

// GET (collection)
router.get("/movies", movieController.getAllMovieVotes); // Returns all movies and how many entries they have in the pool
router.get("/movies/matches", movieController.getAllMatches); // Get all matches
router.get("/movies/ratings", movieController.getAllRatings); // Get all ratings (with optional filtering)
router.get("/movies/ratings/:ratingId", movieController.getRatingById);

// DELETE (collection)
router.delete("/movies", movieController.resetMovieVotes); // Deletes all entries for a movie (if criteria is met)
router.delete("/movies/matches", movieController.deleteAllMatches); // Deletes all matches (not for regular users)

// GET (individual)
router.get("/movies/:movieId", movieController.getMovieVotes); // Returns a movieId and its total amount of entries in the pool
router.get("/movies/matches/:matchId", movieController.getMatchById); // Returns a match

// PUT (individual)
router.put("/movies/ratings/:ratingId", movieController.updateMovieRating); // Update user rating

// PATCH (individual)
router.patch("/movies/matches/:matchId", movieController.addUserToMatch); // Adds a second user to an existing match

// DELETE (individual)
router.delete("/movies/ratings/:ratingId", movieController.deleteMovieRating); // Deletes a specific rating

// GET (relationship)
router.get("/movies/:movieId/ratings", movieController.getMovieRatings); // Returns all ratings saved for a movie
router.get("/users/:userId/tokens", movieController.getUserTokens); // Returns remaining vote tokens for a user

// GET (double relationship)
router.get(
  "/movies/:movieId/ratings/:userId",
  movieController.getUserMovieRating
); // Returns a specific user's rating for one specific movie

// DELETE (double relationship)
router.delete(
  "/users/:userId/watched-movies/:movieId",
  movieController.deleteWatchedMovieFromUser
); // Delete a movie from a user's list of watched movies

module.exports = router;
