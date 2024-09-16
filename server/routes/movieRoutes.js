const express = require('express');
const {getRandomMovie, createMovieMatch, getCurrentUserMatch, voteForMovie,  } = require('../controllers/movieController');
const router = express.Router();

router.post('/movies/random', getRandomMovie); // Matching user with a movie and another user
router.post('/movies/match', createMovieMatch); // Creates a match with users and a movie
router.patch('/users/:userId/current-match', updateCurrentMatch); // Updates the currentMatch for a user
router.get('/movies/match/:userId', getCurrentUserMatch); // Returns the current movie match for a user
router.post('/movies/vote', voteForMovie); // Spends 1-5 tokens to vote for a movie
router.get('/movies/tokens/:userId', getUserTokens); // Returns remaining vote tokens for a user
router.get('/movies/votes', getAllMovieVotes); // Returns how many votes each movie has
router.get('/movies/votes/:movieId', getAllMovieVotes); // Returns how many a specific movie has
router.delete('/movies/reset-votes/:movieId', resetMovieVotes); // Resets the votes for a movie
router.get('/movies/watch-window/:userId', checkWatchWindow); // Checks the remaining time of the 48h watch window for a user

module.exports = router;