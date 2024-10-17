const express = require('express');
const ratingController = require('../controllers/ratingController');
const router = express.Router();

// POST (collection)
router.post("/ratings", ratingController.rateMovie); // Creates a rating for a movie from a specific user

// DELETE (individual)
router.delete('/ratings/:ratingId', ratingController.deleteMovieRating);

// GET (collection)
router.get('/ratings', ratingController.getAllRatings); // Get all ratings (with optional filtering)

// PUT (individual)
router.put('/ratings/:ratingId', ratingController.updateMovieRating); // Update existing user rating with a new one

// GET (relationship, example: /cars/:car_id/drivers)
router.get("/movies/:movieId/ratings", ratingController.getMovieRatings); // Returns all ratings saved for a movie
router.get('/users/:userId/ratings', ratingController.getUserRatings); // Retrieves ratings for a specific user

// GET (double relationship, example: /cars/:car_id/drivers/:driver_id)
router.get('/movies/:movieId/ratings/:userId', ratingController.getUserMovieRating); // Returns a specific users rating for one specific movie


module.exports = router;