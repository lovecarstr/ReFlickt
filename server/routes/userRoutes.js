const express = require('express');
const { getAllUsers, createNewUser } = require('../controllers/userController');
const router = express.Router();

// Define routes and link to controller functions
router.get('/getAllUsers', getAllUsers);
router.post('/createNewUser', createNewUser);

module.exports = router;