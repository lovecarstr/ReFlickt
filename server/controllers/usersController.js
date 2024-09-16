const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');  // Adjust the path to wherever your User model is defined


// GET all users
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find({});
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error });
    }
};

// POST a new user
const createNewUser = async (req, res) => {
    const user = new User(req.body);
    try {
        const savedUser = await user.save();
        res.status(201).json(savedUser);
    } catch (error) {
        res.status(400).json({ message: 'Failed to create user', error });
    }
};

// GET a specific users movie ratings
const getUserRatings = async (req, res) => {

};

module.exports = {getAllUsers, createNewUser};