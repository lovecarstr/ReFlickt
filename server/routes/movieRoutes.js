const express = require('express');
const { createMatch, getCurrentUserMatch } = require('../controllers/movieController');
const router = express.Router();

router.post('/movie/match', createMatch); // Matching user with a movie and another user
router.get('/match/match/:userId', getCurrentUserMatch); // Returns the current movie match for a user

module.exports = router;