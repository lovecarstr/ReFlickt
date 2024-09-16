const express = require('express');
const { getAllUsers, createNewUser } = require('../controllers/usersController');
const router = express.Router();

// Define routes and link to controller functions
router.get('/getAllUsers', getAllUsers);
router.post('/createNewUser', createNewUser);
router.get('/users/:userId/ratings', getUserRatings); // Retrieves ratings from a specific user

module.exports = router;