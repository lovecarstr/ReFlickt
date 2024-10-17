const express = require('express');
const entryController = require('../controllers/entryController');
const router = express.Router();


// UNCATEGORIZED
router.get('/entries/random', entryController.getRandomMovie); // Retrieves a random movie from open matches or movie entries
router.delete('/entries/reset', entryController.resetMovieVotes); // Deletes entries for all movies that meet the max amout of matches criteria

// GET (collection)
router.get('/entries', entryController.getAllEntries); // Returns all movies and how many entries they have in the pool

// DELETE (collection)
router.delete('/entries/', entryController.deleteAllEntries); // Deletes all entries

// POST (collection)
router.post('/entries', entryController.addMovieEntry); // Spends 1-5 tokens to vote for a movie and add it as an entry to the pool

// GET (individual)
router.get('/entries/:movieId', entryController.getEntryWithVotes); // Returns an entry and its total amount of entries in the pool








module.exports = router;