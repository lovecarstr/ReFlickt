const express = require('express');
const {getRandomMovie, createNewMatch, addUserToMatch, addMovieEntry } = require('../controllers/movieController');
const router = express.Router();

router.get('/movies/random', getRandomMovie); // Retrieves a random movie from open matches or movie entries
router.post('/movies/match/new', createNewMatch); // Creates a new match with a single user and a movie entry
router.post('/movies/match/open', addUserToMatch); // Adds a second user to an exisiting match
router.post('/movies/vote', addMovieEntry); // Spends 1-5 tokens to vote for a movie and add it as an entry

/*

router.patch('/users/:userId/current-match', updateCurrentMatch); // Updates the currentMatch for a user
router.get('/movies/match/:userId', getCurrentUserMatch); // Returns the current movie match for a user
router.get('/movies/tokens/:userId', getUserTokens); // Returns remaining vote tokens for a user
router.get('/movies/votes', getAllMovieVotes); // Returns how many votes each movie has
router.get('/movies/votes/:movieId', getAllMovieVotes); // Returns how many a specific movie has
router.delete('/movies/reset-votes/:movieId', resetMovieVotes); // Resets the votes for a movie
router.get('/movies/watch-window/:userId', checkWatchWindow); // Checks the remaining time of the 48h watch window for a user

*/

module.exports = router;