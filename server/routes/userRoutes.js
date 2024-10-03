const express = require('express');
const { getAllUsers, createNewUser } = require('../controllers/userController');
const router = express.Router();

// Define routes and link to controller functions
router.get('/users', getAllUsers);
router.post('/users', createNewUser);

module.exports = router;