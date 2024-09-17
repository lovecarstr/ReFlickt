const express = require("express");
const {
  getRandomMovie,
  getCurrentUserMatch,
  rateMovie,
  getMovieRatings,
  getUserMovieRating,
} = require("../controllers/movieController");
const router = express.Router();

router.post("/movies/random", getRandomMovie); // Matching user with a movie and another user
router.post("/movies/match", createMovieMatch); // Creates a match with users and a movie
router.get("/movies/match/:userId", getCurrentUserMatch); // Returns the current movie match for a user
router.post("/movies/rate", rateMovie); // Creates a rating for a movie from a specific user
router.get("/movies/:movieId/ratings", getMovieRatings); // Returns all ratings saved for a movie
router.get('/movies/:movieId/ratings/:userId', getUserMovieRating); // Returns a specific users rating for one specific movie

module.exports = router;
