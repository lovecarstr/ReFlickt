const express = require('express');
const { getRandomMovie, getCurrentUserMatch } = require('../controllers/movieController');
const router = express.Router();

router.post('/movies/random', getRandomMovie); // Matching user with a movie and another user
router.post('/movies/match', createMovieMatch) // Creates a match with users and a movie
router.get('/movies/match/:userId', getCurrentUserMatch); // Returns the current movie match for a user


module.exports = router;