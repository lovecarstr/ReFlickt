const express = require('express');
const movieController = require('../controllers/movieController');
const router = express.Router();

// Tested and working
router.get('/movies/random', movieController.getRandomMovie); // Retrieves a random movie from open matches or movie entries
router.post('/movies/match/new', movieController.createNewMatch); // Creates a new match with a single user and a movie entry
router.post('/movies/match/open', movieController.addUserToMatch); // Adds a second user to an exisiting match
router.post('/movies/vote', movieController.addMovieEntry); // Spends 1-5 tokens to vote for a movie and add it as an entry
router.patch('/users/current-match', movieController.updateCurrentUserMatch); // Updates the currentMatch for a user
router.post("/movies/rate", movieController.rateMovie); // Creates a rating for a movie from a specific user
router.get("/movies/:movieId/ratings", movieController.getMovieRatings); // Returns all ratings saved for a movie
router.get('/movies/:movieId/ratings/:userId', movieController.getUserMovieRating); // Returns a specific users rating for one specific movie
router.get('/movies/match/:userId', movieController.getCurrentUserMatch); // Returns the current movie match for a user
router.get('/movies/tokens/:userId', movieController.getUserTokens); // Returns remaining vote tokens for a user
router.get('/movies/votes', movieController.getAllMovieVotes); // Returns how many votes each movie has
router.get('/movies/votes/:movieId', movieController.getMovieVotes); // Returns how many a specific movie has
router.delete('/movies/reset-votes', movieController.resetMovieVotes); // Resets the votes for a movie
router.get('/movies/watch-window/:userId', movieController.checkWatchWindow); // Checks the remaining time of the 48h watch window for a user

// To be added:
// - Fix route naming according to conventions / best practices. For example: movies/matches not match
// - PATCH: Reset user tokens to 5
// - PUT: Update a user rating


// TMDB (tested and working)
router.get("/movies/search", movieController.searchMovie);
router.get("/movies/:movieId/details", movieController.getMovieDetails);


module.exports = router;
