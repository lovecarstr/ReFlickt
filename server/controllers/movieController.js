const express = require("express");
const mongoose = require("mongoose");

const Movie = require('../models/movie');
const User = require('../models/user');
const MovieEntry = require('../models/movieEntry');
const MovieMatch = require('../models/movieMatch');


// Checks open matches to find a movie for a user to be matched with. If there are no 
// open matches, it will instead select a random one from the list of entries not yet matched with any users.
const getRandomMovie = async (req, res) => {
    const { userId } = req.params; 

    try {
        // Check for open matches
        const openMatch = await MovieMatch.findOne({ status: 'Open' });

        if (openMatch) {
            // Check if the user has watched the movie
            const user = await User.findById(userId);
            const watchedMovies = user.watchedMovies;

            if (!watchedMovies.includes(openMatch.movieId)) {
                // Return the movie ID and match ID
                return res.status(200).json({
                    movieId: openMatch.movieId,
                    matchId: openMatch._id
                });
            }
        }

        // Fallback: No open matches or all matches are watched by the user
        const randomEntry = await MovieEntry.aggregate([{ $sample: { size: 1 } }]); // Randomly select one entry

        if (randomEntry.length > 0) {
            return res.status(200).json({ movieId: randomEntry[0]._id }); // Return only movieId
        }

        return res.status(404).json({ message: 'No movies available' }); // Handle case where no movie is found
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Server error' }); // Handle server errors
    }
};

// Creates a new, open match for a user with a movie.
const createNewMatch = async (req, res) => {
    const { movieId, userId } = req.body;

    try {
      const newMatch = new MovieMatch({
        movieId: movieId,  
        firstUserId: userId, 
        secondUserId: null,
        status: 'Open'
      });

        // Increment the count for the movie entry, so that its votes can be reset after the threshold.
        await MovieEntry.findOneAndUpdate(
            { movieId: movieId },
            { $inc: { count: 1 } }
        );

        await newMatch.save();
        res.status(201).json({ message: 'New match created', match: newMatch });
    } catch (error) {
        res.status(500).json({ error: 'Error creating new match' });
    }
};

// Matches a second user to an open match, and sets its status to closed.
const addUserToMatch = async (req, res) => {
    const { matchId, userId } = req.body;

    try {
        const match = await MovieMatch.findById(matchId);

        match.secondUserId = userId;
        match.status = 'Closed';

        await match.save();

        res.status(200).json({ message: 'User added to match', match: match });
    } catch (error) {
        res.status(500).json({ error: 'Error adding user to match' });
    }
};

// Spends tokens to add movies to the movieEntries collection
const addMovieEntry = async (req, res) => {
    const { userId, movieId, tokens } = req.body; 

    try {
        const user = await User.findById(userId);

        // Check if the user has enough tokens
        if (tokens > user.tokens) {
            return res.status(400).json({ error: 'Not enough tokens' });
        }

        for (let i = 0; i < tokens; i++) {
            const entry = new MovieEntry({
                movieId: movieId  
            });
            await entry.save();  // Save each entry in the database
        }
        res.status(201).json({ message: 'Movie entries added successfully' });
    } catch (error) {
        res.status(500).json({ error: 'Error adding movie entries' });
    }
};

const updateCurrentUserMatch = async (req, res) => {
  const { userId, matchId } = req.body;

  try {
      const updatedUser = await User.findByIdAndUpdate(
          userId, 
          { currentMatch: matchId },
          { new: true }
      );

      // If the user was not found
      if (!updatedUser) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Send back the updated user
      return res.status(200).json({ message: 'User match updated successfully', user: updatedUser });

  } catch (error) {
      return res.status(500).json({ error: 'Error updating user match', details: error.message });
  }
};

const getMovieRatings = async (req, res) => {
  const movieId = req.params.movieID;
  try {
    // Retrieve all ratings for the specified movie
    const ratings = await MovieRating.find({ movieId: movieId })
      .populate("userId", "username") // Populate userId with username
      .exec();

    // Check if any ratings were found
    if (ratings.length === 0) {
      return res
        .status(404)
        .json({ message: "No ratings found for this movie" });
    }

    // Send JSON response to client
    res.json({
      movieId: movieId,
      ratings: ratings,
    });
  } catch (error) {
    console.error("Error fetching ratings:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getUserMovieRating = async (req, res) => {
  try {
    const { movieId, userId } = req.params;

    // Query the rating for the specific movie and user
    const rating = await MovieRating.findOne({ movieId, userId })
      .populate("userId", "username") // Optionally populate the username if needed
      .populate("movieId", "title"); // Optionally populate the movie title if needed

    // If no rating is found, send a 404 error
    if (!rating) {
      return res
        .status(404)
        .json({ message: "No rating found for this user and movie" });
    }

    // Send the rating in the response
    res.status(200).json({ rating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

const rateMovie = async (req, res) => {
  try {
    const {
      movieId,
      userId,
      recommendation,
      story,
      performances,
      directing,
      visuals,
      sound,
    } = req.body;

    // We need to check that the movieID is a valid one
    //const movie = await Movie.findById(movieId);
    //if (!movie) {
    //  return res.status(404).json({ message: "Movie not found" });
    //}

    const newRating = new movieRating({
      movieId,
      userId,
      recommendation,
      story,
      performances,
      directing,
      visuals,
      sound,
    });

    await newRating.save();

    res
      .status(201)
      .json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

/*

const getUserTokens = async (req, res) => {

};

const getAllMovieVotes = async (req, res) => {

};

const getMovieVotes = async (req, res) => {

};

const checkWatchWindow = async (req, res) => {

};

const resetMovieVotes = async (req, res) => {

};

*/


module.exports = { getRandomMovie, createNewMatch, addUserToMatch, addMovieEntry, 
    updateCurrentUserMatch, rateMovie, getMovieRatings, getUserMovieRating };

