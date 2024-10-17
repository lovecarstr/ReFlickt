const express = require('express');
const matchController = require('../controllers/matchController');
const router = express.Router();

// UNCATEGORIZED
router.patch('/matches/decline', matchController.declineMatch); // User declines a match with a random movie

// POST (collection)
router.post('/matches', matchController.createNewMatch); // Creates a new match with a single user and a movie entry

// PATCH (individual)
router.patch('/matches/:matchId', matchController.addUserToMatch); // Updates a match include a second user

// GET (collection)
router.get('/matches', matchController.getAllMatches); // Gets all matches

// DELETE (collection)
router.delete('/matches', matchController.deleteAllMatches); // Deletes all matches (not for regular users)

// GET (individual)
router.get('/matches/:matchId', matchController.getMatchById); // Returns a match

module.exports = router;