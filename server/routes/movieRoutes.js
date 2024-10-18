const express = require("express");
const movieController = require("../controllers/movieController");
const router = express.Router();

router.get("/movies/search", movieController.searchMovie); // Search the external movie database for a movie based on title
router.get("/movies/:movieId/details", movieController.getMovieDetails); // Returns a response of detailed movie information, including actor pictures, etc.
router.get("/movies/:movieId/basic", movieController.getMovieBasicInfo); // Returns basic info for a movie, i.e. title, year, poster and id (better performance)

module.exports = router;
