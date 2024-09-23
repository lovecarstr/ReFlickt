const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();


// UNCATEGORIZED
router.get("/movies/search", movieController.searchMovie); // Search the database for a movie based on title
router.get('/movies/random', movieController.getRandomMovie); // Retrieves a random movie from open matches or movie entries
router.get("/movies/:movieId/details", movieController.getMovieDetails);
router.get('/users/:userId/matches/window', movieController.checkWatchWindow);// Checks the remaining time of the 48h watch window for a user
router.put('/movies/:movieId/ratings/:userId', movieController.updateMovieRating); // Update user rating
router.patch('/users/:userId/matches/:matchId', movieController.updateCurrentUserMatch); // Updates the currentMatch for a user
router.patch('/users/:userId/tokens', movieController.refillUserTokens); // Refills user tokens if enough time has passed since last refill


// POST (collection)
router.post('/movies', movieController.addMovieEntry); // Spends 1-5 tokens to vote for a movie and add it as an entry to the pool
router.post('/movies/matches', movieController.createNewMatch); // Creates a new match with a single user and a movie entry
router.post("/movies/ratings", movieController.rateMovie); // Creates a rating for a movie from a specific user

// GET (collection)
router.get('/movies', movieController.getAllMovieVotes); // Returns all movies and how many entries they have in the pool
router.get('/movies/matches', movieController.getAllMatches); // Get all matches
router.get('/movies/ratings', movieController.getAllRatings); // Get all ratings (with optional filtering)

// DELETE (collection)
router.delete('/movies', movieController.resetMovieVotes); // Deletes all entries for a movie (if criteria is met)
router.delete('/movies/matches', movieController.deleteAllMatches); // Deletes all matches (not for regular users)

// GET (individual)
router.get('/movies/:movieId', movieController.getMovieVotes); // Returns a movieId and its total amount of entries in the pool
router.get('/movies/matches/:matchId', movieController.getMatchById); // Returns a match

// PUT (individual)


// PATCH (individual)
router.patch('/movies/matches/:matchId', movieController.addUserToMatch); // Adds a second user to an exisiting match

// DELETE (individual)
router.delete('/movies/ratings/:ratingId', movieController.deleteMovieRating);

// POST (relationship, example: /cars/:car_id/drivers)


// GET (relationship, example: /cars/:car_id/drivers)
router.get("/movies/:movieId/ratings", movieController.getMovieRatings); // Returns all ratings saved for a movie
router.get('/users/:userId/tokens', movieController.getUserTokens); // Returns remaining vote tokens for a user

// GET (double relationship, example: /cars/:car_id/drivers/:driver_id)
router.get('/movies/:movieId/ratings/:userId', movieController.getUserMovieRating); // Returns a specific users rating for one specific movie

// DELETE (double relationship, example: /cars/:car_id/drivers/:driver_id)


module.exports = router;
