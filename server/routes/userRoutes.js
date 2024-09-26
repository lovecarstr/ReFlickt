const express = require('express');
const { getAllUsers, createNewUser, getUserRatings,getUserNotifications } = require('../controllers/userController');
const router = express.Router();

// Define routes and link to controller functions
router.get('/users', getAllUsers);
router.post('/users', createNewUser);
router.get('/users/:userId/ratings', getUserRatings); // Retrieves ratings from a specific user
router.get('/users/:userID/notifications', getUserNotifications); //Retrives a specific users notifications

module.exports = router;