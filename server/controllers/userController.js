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

const createNewUser = async (req, res) => {
  const { username, password, email } = req.body;

  // Ensure required fields are provided
  if (!username || !password || !email) {
    return res.status(400).json({ message: "Username, password, and email are required" });
  }

  // Create a new user
  const user = new User({
    username,
    password,
    email,
  });

  try {
    const savedUser = await user.save();
    res.status(201).json(savedUser); // Return the created user object
  } catch (error) {
    // Handle possible validation errors or uniqueness issues (like duplicate email/username)
    res.status(400).json({
      message: "Failed to create user",
      error: error.message || error,
    });
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
const getUserNotifications = async (req, res) => {
  const userId = req.params.userID;
  try{
    const user = await User.findById(userId).populate('notifications');; // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    } 
    if (user.notifications.length === 0){
      return res.status(200).json({ message: "No notifications found", notifications: [] });
    }

    res.status(200).json({notifications: user.notifications});
  } catch(error){
    res.status(500).json({error: error.message})
  }
}

module.exports = { getAllUsers, createNewUser, getUserRatings, getUserNotifications };
