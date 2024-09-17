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
    res.status(400).json({ message: "Failed to create user", error });
  }
};

// GET a specific users movie ratings
const getUserRatings = async (req, res) => {
  const userId = req.params.userId;
  try {
    const user = await User.findById(userId); // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    // Find all ratings by this user
    const ratings = await MovieRating.find({ userId }).populate(
      "movieId",
      "title director year"
    );

    if (ratings.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this user" });
    }

    // Send the ratings
    res.status(200).json({ ratings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { getAllUsers, createNewUser, getUserRatings };
