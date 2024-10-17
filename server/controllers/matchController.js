const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");
const MovieEntry = require("../models/movieEntry");
const MovieMatch = require("../models/movieMatch");

const MOVIE_WATCH_WINDOW = 48 * 60 * 60 * 1000; // 48 hours in milliseconds

const matchController = {
  // Creates a new, open match for a user with a movie.
  createNewMatch: async (req, res) => {
    const { userId } = req.body;

    try {
      const user = await User.findById(userId);
      if (!user) {
        res.status(404).json({ message: "User not found" });
      }

      const newMatch = new MovieMatch({
        movieId: user.currentMovieRoll.movieId,
        firstUserId: userId,
        secondUserId: null,
        status: "Open",
      });

      // Increment the matchCount for the movie entry, so that its votes can be reset after the threshold.
      await MovieEntry.findOneAndUpdate(
        { movieId: user.currentMovieRoll.movieId },
        { $inc: { matchCount: 1 } }
      );

      await newMatch.save();
      user.currentMatch = newMatch;
      await user.save();
      res.status(201).json({ message: "New match created", match: newMatch });
    } catch (error) {
      res.status(500).json({ error: "Error creating new match" });
    }
  },

  // Matches a second user to an open match, and sets its status to closed.
  addUserToMatch: async (req, res) => {
    const { userId } = req.body;
    const { matchId } = req.params;

    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const match = await MovieMatch.findById(matchId);
      if (!match) {
        return res.status(404).json({ error: "Match not found" });
      }

      // Check if the match has expired
      const now = new Date();
      const reservationExpiresAt = match.reservationExpiresAt;

      if (reservationExpiresAt && now > reservationExpiresAt) {
        return res.status(400).json({ message: "Match has expired" });
      }

      // Check if the match already has two users
      if (match.secondUserId) {
        return res.status(400).json({ error: "Match already has two users" });
      }

      // Set the second user and calculate expiration
      match.secondUserId = userId;
      match.status = "Closed";
      match.watchWindowExpiresAt = new Date(Date.now() + MOVIE_WATCH_WINDOW); // Set the watch window end time

      await match.save();

      user.currentMatch = matchId; // Optionally update the user with the current match
      await user.save();

      res.status(200).json({ message: "User added to match", match });
    } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: "Error adding user to match" });
    }
  },

  declineMatch: async (req, res) => {
    const { matchId, userId } = req.body; 
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // If there is a matchId, clear the reservation
      if (matchId) {
        const match = await MovieMatch.findById(matchId);
  
        // Check if the match exists and if the user is the one who reserved it
        if (match && match.reservedBy.toString() === userId) {
          // Clear the reservation
          match.reservedBy = null;
          match.reservationExpiresAt = null;
          await match.save();
        } else {
          return res.status(403).json({ message: 'Unable to decline match or invalid match.' });
        }
      }
  
      // Reset current movie roll data if match is declined
      user.currentMovieRoll.movieId = null;
      user.currentMovieRoll.matchId = null;
  
      await user.save();
  
      return res.status(200).json({ message: 'Match declined and movie roll cleared.' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Server error' });
    }
  },

  getAllMatches: async (req, res) => {
    try {
      const matches = await MovieMatch.find();
      return res.status(200).json(matches);
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching matches' });
    }
  },

  deleteAllMatches: async (req, res) => {
    try {
      await MovieMatch.deleteMany();
      return res.status(200).json({ message: 'All matches deleted successfully' });
    } catch (error) {
      return res.status(500).json({ error: 'Error deleting matches' });
    }
  },

  getMatchById: async (req, res) => {
    const { matchId } = req.params; // Get matchId from the route parameters
  
    try {
      // Find the match by ID
      const match = await MovieMatch.findById(matchId)
        .populate('firstUserId') // Assuming you want to populate user details
        .populate('secondUserId'); // Assuming a second user reference exists
  
      // If the match was not found
      if (!match) {
        return res.status(404).json({ error: 'Match not found' });
      }
  
      // Return the found match
      return res.status(200).json({ match });
    } catch (error) {
      return res.status(500).json({ error: 'Error retrieving match', details: error.message });
    }
  },
};

module.exports = matchController;
