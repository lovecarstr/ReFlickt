const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");
const { getLatestMessage } = require("./discussionController");
const Discussion = require("../models/discussion");
const MovieRating = require("../models/movieRating");
const MovieMatch = require("../models/movieMatch");

const HOURS_BETWEEN_TOKEN_REFILLS = 24;
const DAILY_TOKEN_AMOUNT = 5;

const userController = {
  // GET all users
  getAllUsers: async (req, res) => {
    try {
      const users = await User.find({});
      res.status(200).json(users);
    } catch (error) {
      res.status(500).json({ message: "Error fetching users", error });
    }
  },

  // GET a users profile
  getUserProfile: async (req, res) => {
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
  },

  getUserTokens: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId).select("tokens");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      return res.status(200).json({ tokens: user.tokens });
    } catch (error) {
      return res.status(500).json({ error: "Error fetching user tokens" });
    }
  },

  deleteWatchedMovieFromUser: async (req, res) => {
    const { userId, movieId } = req.params;

    try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      // Check if the movie exists in the watchedMovies array
      const movieIndex = user.watchedMovies.indexOf(movieId);

      if (movieIndex === -1) {
        return res
          .status(404)
          .json({ error: "Movie not found in user's watched list" });
      }

      // Remove the movie from the watchedMovies array
      user.watchedMovies.splice(movieIndex, 1);

      // Save the updated user
      await user.save();

      res
        .status(200)
        .json({
          message: "Movie removed from user's watched list successfully",
        });
    } catch (error) {
      res
        .status(500)
        .json({
          error: "Error removing movie from watched list",
          details: error.message,
        });
    }
  },

  refillUserTokens: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const now = new Date();
      const hoursSinceLastRefill =
        (now.getTime() - user.tokensRefilled.getTime()) / (1000 * 60 * 60);

      // Check if correct amount of hours have passed since the last refill
      if (hoursSinceLastRefill >= HOURS_BETWEEN_TOKEN_REFILLS) {
        user.tokens = DAILY_TOKEN_AMOUNT;
        user.tokensRefilled = now; // This if off by 2 hours currently
        await user.save();

        return res
          .status(200)
          .json({ message: "Tokens refilled", tokens: user.tokens });
      } else {
        const hoursLeft = HOURS_BETWEEN_TOKEN_REFILLS - hoursSinceLastRefill;
        return res
          .status(400)
          .json({
            message: `Tokens refill not available yet. Try again in ${hoursLeft.toFixed(
              2
            )} hours.`,
          });
      }
    } catch (error) {
      return res.status(500).json({ error: "Error refilling tokens" });
    }
  },

  // Check if the watch window is still open for the current match of a specific user
  checkWatchWindow: async (req, res) => {
    const { userId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user || !user.currentMatch) {
        return res
          .status(404)
          .json({ error: "User or current match not found" });
      }

      const matchId = user.currentMatch;

      const match = await MovieMatch.findById(matchId);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // Check if the watch window has expired
      if (match.watchWindowExpiresAt) {
        const expired =
          Date.now() > new Date(match.watchWindowExpiresAt).getTime();
        if (expired) {
          return res.status(400).json({ message: "Watch window has expired" });
        }
        return res.status(200).json({ message: "Watch window is still open" });
      }

      return res.status(400).json({ message: "No match has been closed yet" });
    } catch (error) {
      return res.status(500).json({ error: "Error checking watch window" });
    }
  },

  // Sets a user's currentMatch to null
  resetCurrentMatch: async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      user.currentMatch = null;
  
      await user.save();
      return res.status(200).json({ message: 'Current match reset successfully' });
    } catch (error) {
      console.error('Error resetting current match:', error);
      return res.status(500).json({ error: 'Server error, could not reset current match' });
    }
  },

  // Resets the currentMovieRoll object values to null
  resetCurrentMovieRoll: async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Reset the fields in currentMovieRoll
      user.currentMovieRoll = {
        movieId: null,
        matchId: null,
        canRollAgainAt: null
      };
  
      await user.save();
      return res.status(200).json({ message: 'Current movie roll reset successfully' });
    } catch (error) {
      console.error('Error resetting current movie roll:', error);
      return res.status(500).json({ error: 'Server error, could not reset current movie roll' });
    }
  },

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
};

module.exports = userController;
