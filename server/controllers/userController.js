const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');
const { getLatestMessage } = require('./discussionController');
const Discussion = require('../models/discussion');
const MovieRating = require('../models/movieRating');

// GET all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ message: "Error fetching users", error });
  }
};

const createNewUser = async (req, res) => {
  const { username, password, email } = req.body;

  // Ensure required fields are provided
  if (!username || !password || !email) {
    return res
      .status(400)
      .json({ message: "Username, password, and email are required" });
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

// GET a users profile
const getUserProfile = async (req, res) => {
  try {
    // Get the user ID from the authenticated user
    const userId = req.user.userId; // This assumes your token contains 'userId'

    // Fetch the user from the database, excluding the password field
    const user = await User.findById(userId).select("-password");

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Send the user data in the response
    res.status(200).json({ user });
  } catch (error) {
    console.error("Error fetching user profile:", error);
    res.status(500).json({ message: "Server error." });
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
/*
const getUser = async (req, res) => {
  const userId = req.params.userId;
  
  try {
    const user = await User.findById(userId); // Check if user exists
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({ user });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
*/

module.exports = { getAllUsers, createNewUser, getUserRatings, getUserProfile };
