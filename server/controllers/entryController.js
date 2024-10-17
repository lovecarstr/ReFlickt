const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");
const MovieEntry = require("../models/movieEntry");
const MovieMatch = require("../models/movieMatch");

const MAX_AMOUNT_MATCHES = 5; // The maximum number of matches that are allowed to be created before movie entries are deleted
const TIME_BETWEEN_ROLLS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const TIME_LIMIT_FOR_RESERVATION = 5 * 60 * 1000; // 5 minutes in milliseconds

const entryController = {

  // Spends tokens to add movies to the movieEntries collection
  addMovieEntry: async (req, res) => {
    const { userId, movieId, movieTitle, moviePoster, tokens } = req.body;

    try {
      const user = await User.findById(userId);

      // Check if the user has enough tokens
      if (tokens > user.tokens) {
        return res.status(400).json({ message: "Not enough tokens" });
      }

      // User must spend at least 1 token
      if (tokens < 1) {
        return res
          .status(400)
          .json({ message: "At least 1 token is required to vote" });
      }

      for (let i = 0; i < tokens; i++) {
        const entry = new MovieEntry({
          movieId: movieId,
          movieTitle: movieTitle,
          moviePoster: moviePoster,
        });
        await entry.save(); // Save each entry in the database
        user.tokens -= 1; // Decrement tokens by one for each vote
      }
      await user.save();

      res.status(201).json({ message: "Movie entries added successfully" });
    } catch (error) {
      res.status(500).json({ message: "Error adding movie entries" });
    }
  },

  // Checks open matches to find a movie for a user to be matched with.
  // If there are no open matches, it will instead select a random one from the list of entries not yet matched with any users.
  getRandomMovie: async (req, res, next) => {
    // Add `next` as a parameter
    const { userId } = req.query; // Retrieve userId from query parameters

    try {
      const user = await User.findById(userId);

      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      const now = new Date();

      // Safely check if currentMovieRoll exists before accessing nested fields
      if (user.currentMovieRoll && user.currentMovieRoll.canRollAgainAt) {
        const canRollAgainAt = new Date(user.currentMovieRoll.canRollAgainAt);

        // If current time is less than canRollAgainAt, they cannot roll
        if (now < canRollAgainAt) {
          const timeRemaining = canRollAgainAt - now; // Time remaining in milliseconds
          const remainingHours = timeRemaining / (1000 * 60 * 60); // Convert to hours
          return res.status(403).json({
            message: `You need to wait ${remainingHours.toFixed(
              2
            )} more hours before rolling again.`,
          });
        }
      }

      // Check for open matches that are not reserved or have expired
      const openMatch = await MovieMatch.findOne({
        status: "Open",
        $or: [
          { reservedBy: null }, // Not reserved
          { reservationExpiresAt: { $lt: now } }, // Expired reservations
        ],
      });

      if (openMatch) {
        const watchedMovies = user.watchedMovies;

        // Check if the user has already watched the movie in the open match
        if (!watchedMovies.includes(openMatch.movieId)) {
          // Reserve this match for the user
          openMatch.reservedBy = userId;
          openMatch.reservationExpiresAt = new Date(
            now.getTime() + TIME_LIMIT_FOR_RESERVATION
          );
          await openMatch.save();

          // Update the currentMovieRoll with the matchId and canRollAgainAt
          user.currentMovieRoll = {
            movieId: openMatch.movieId,
            matchId: openMatch._id,
            canRollAgainAt: new Date(Date.now() + TIME_BETWEEN_ROLLS), // Update with the cooldown period
          };
          await user.save();

          // Return the movie ID and match ID
          return res.status(200).json({
            movieId: openMatch.movieId,
            matchId: openMatch._id,
          });
        }
      }

      // Fallback: No open matches or all matches are watched by the user
      const randomEntry = await MovieEntry.aggregate([
        { $sample: { size: 1 } },
      ]);

      if (randomEntry.length > 0) {
        // Update the currentMovieRoll for a random movie
        user.currentMovieRoll = {
          movieId: randomEntry[0].movieId,
          matchId: null, // No match for random movie
          canRollAgainAt: new Date(Date.now() + TIME_BETWEEN_ROLLS), // Update with the cooldown period
        };
        await user.save();

        return res.status(200).json({ movieId: randomEntry[0].movieId });
      }

      return res.status(404).json({ message: "No movies available" });
    } catch (error) {
      console.error(error);
      next(error); // Pass the error to the error handler
    }
  },

  getAllEntries: async (req, res) => {
    try {
      const movieVotes = await MovieEntry.aggregate([
        {
          $group: {
            _id: {
              movieId: "$movieId",
              movieTitle: "$movieTitle",
              moviePoster: "$moviePoster",
            },
            voteCount: { $sum: 1 },
          },
        }, // Group by movieId, movieTitle, and moviePoster
        { $sort: { voteCount: -1 } }, // Sort descending by vote count
        {
          $project: {
            movieId: "$_id.movieId", // Project movieId from the group
            movieTitle: "$_id.movieTitle", // Project movieTitle from the group
            moviePoster: "$_id.moviePoster", // Project moviePoster from the group
            voteCount: 1,
            _id: 0, // Remove the original _id field
          },
        },
      ]);

      return res.status(200).json(movieVotes);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching movie votes" });
    }
  },

  deleteAllEntries: async (req, res) => {
    try {
      await MovieEntry.deleteMany();
      return res
        .status(200)
        .json({ message: "All entries deleted successfully" });
    } catch (error) {
      return res.status(500).json({ error: "Error deleting movie entries" });
    }
  },

  resetMovieVotes: async (req, res) => {
    try {
      // Step 1: Aggregate the total matchCount for each movieId
      const movieVoteSums = await MovieEntry.aggregate([
        {
          $group: {
            _id: "$movieId",
            totalMatchCount: { $sum: "$matchCount" }, // Sum the matchCount for each movieId
          },
        },
      ]);

      // Step 2: Iterate over the aggregated results
      for (const movie of movieVoteSums) {
        if (movie.totalMatchCount > MAX_AMOUNT_MATCHES) {
          // Step 3: Delete all entries for this movieId if the total matchCount exceeds MAX_AMOUNT_MATCHES
          await MovieEntry.deleteMany({ movieId: movie._id });
          console.log(`Movie entries reset for movieId: ${movie._id}`);
        }
      }

      // Send a response after processing all movies
      return res
        .status(200)
        .json({ message: "Movie votes reset where applicable." });
    } catch (error) {
      return res.status(500).json({ error: "Error resetting movie votes" });
    }
  },

  getEntryWithVotes: async (req, res) => {
    const { movieId } = req.params;
    
    // Convert movieId to a number since req.params makes it a string
    const movieIdAsNumber = parseInt(movieId, 10);
  
    try {
      const voteCount = await MovieEntry.countDocuments({ movieId: movieIdAsNumber });
      return res.status(200).json({ movieId: movieIdAsNumber, voteCount });
    } catch (error) {
      return res.status(500).json({ error: 'Error fetching movie votes' });
    }
  },
};

module.exports = entryController;
