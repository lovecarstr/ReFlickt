const express = require("express");
const mongoose = require("mongoose");
const movieService = require('../services/movieService');

const User = require('../models/user');
const MovieEntry = require('../models/movieEntry');
const MovieMatch = require('../models/movieMatch');
const MovieRating = require('../models/movieRating');

const MOVIE_WATCH_WINDOW = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const MAX_AMOUNT_MATCHES = 5; // The maximum number of matches that are allowed to be created before movie entries are deleted


const movieController = {

// Checks open matches to find a movie for a user to be matched with. If there are no 
// open matches, it will instead select a random one from the list of entries not yet matched with any users.
getRandomMovie: async (req, res) => {
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
},

// Creates a new, open match for a user with a movie.
createNewMatch: async (req, res) => {
    const { movieId, userId } = req.body;

    try {
      const newMatch = new MovieMatch({
        movieId: movieId,  
        firstUserId: userId, 
        secondUserId: null,
        status: 'Open'
      });

        // Increment the matchCount for the movie entry, so that its votes can be reset after the threshold.
        await MovieEntry.findOneAndUpdate(
            { movieId: movieId },
            { $inc: { matchCount: 1 } }
        );

        await newMatch.save();
        res.status(201).json({ message: 'New match created', match: newMatch });
    } catch (error) {
        res.status(500).json({ error: 'Error creating new match' });
    }
},

// Matches a second user to an open match, and sets its status to closed.
addUserToMatch: async (req, res) => {
  const { matchId, userId } = req.body;

  try {
      const match = await MovieMatch.findById(matchId);
      if (!match) {
          return res.status(404).json({ error: 'Match not found' });
      }

      // Set the second user and close the match
      match.secondUserId = userId;
      match.status = 'Closed';
      match.matchClosedAt = new Date(); // Set the closing time to now, beginning movie watch window

      await match.save();

      res.status(200).json({ message: 'User added to match', match: match });
  } catch (error) {
      res.status(500).json({ error: 'Error adding user to match' });
  }
},

// Spends tokens to add movies to the movieEntries collection
addMovieEntry: async (req, res) => {
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
},

updateCurrentUserMatch: async (req, res) => {
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
},

getCurrentUserMatch: async (req, res) => {
  const { userId } = req.params; // Get userId from the route parameters

  try {
      // Find the user by userId and populate the currentMatch field
      const user = await User.findById(userId).populate('currentMatch');

      if (!user) {
          return res.status(404).json({ message: 'User not found' });
      }

      // Check if there is a current match
      if (!user.currentMatch) {
          return res.status(200).json({ message: 'No current match found for this user' });
      }

      // Return the current match
      return res.status(200).json({ match: user.currentMatch });
  } catch (error) {
      return res.status(500).json({ error: 'Error retrieving current match' });
  }
},

getMovieRatings: async (req, res) => {
  const movieId = req.params.movieId;
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
},

getUserMovieRating: async (req, res) => {
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
},

rateMovie: async (req, res) => {
  try {
    const { movieId, userId, recommendation, story, performances, directing, visuals, sound } = req.body;

    // We need to check that the movieID is a valid one here
   
    const newRating = new MovieRating({
      movieId: movieId,
      userId: userId,
      recommendation: recommendation,
      story: story,
      performances: performances,
      directing: directing,
      visuals: visuals,
      sound: sound,
    });

    await newRating.save();

    res
      .status(201)
      .json({ message: "Rating submitted successfully", rating: newRating });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
},

getUserTokens: async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId).select('tokens'); 
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.status(200).json({ tokens: user.tokens });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching user tokens' });
  }
},

getAllMovieVotes: async (req, res) => {
  try {
    const movieVotes = await MovieEntry.aggregate([
      { $group: { _id: '$movieId', voteCount: { $sum: 1 } } }, // Group by movieId and count occurrences
      { $sort: { voteCount: -1 } } // Sort descending by vote count
    ]);

    return res.status(200).json(movieVotes);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching movie votes' });
  }
},

getMovieVotes: async (req, res) => {
  const { movieId } = req.params;

  try {
    const voteCount = await MovieEntry.countDocuments({ movieId });
    return res.status(200).json({ movieId, voteCount });
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching movie votes' });
  }
},

// Check if the watch window is still open for a specific match
checkWatchWindow: async (req, res) => {
  const { matchId } = req.params;

  try {
      const match = await MovieMatch.findById(matchId);
      if (!match) {
          return res.status(404).json({ error: 'Match not found' });
      }

      if (match.matchClosedAt) {
          const expired = Date.now() > new Date(match.matchClosedAt).getTime() + MOVIE_WATCH_WINDOW;
          if (expired) {
              return res.status(400).json({ message: 'Watch window has expired' });
          }
          return res.status(200).json({ message: 'Watch window is still open' });
      }

      return res.status(400).json({ message: 'No match has been closed yet' });
  } catch (error) {
      return res.status(500).json({ error: 'Error checking watch window' });
  }
},

resetMovieVotes: async (req, res) => {
  const { movieId } = req.params;

  try {
    // Step 1: Sum the `count` values for all entries with the given movieId
    const totalMovieCount = await MovieEntry.aggregate([
      { $match: { movieId: movieId } },  // Match entries with the given movieId
      { $group: { _id: '$movieId', totalCount: { $sum: '$count' } } }  // Sum the count fields
    ]);

    // Check if totalMovieCount is empty (if no entries were found)
    if (totalMovieCount.length === 0) {
      return res.status(404).json({ error: 'No entries found for this movieId' });
    }

    // Step 2: Check if the total count exceeds 5
    if (totalMovieCount[0].totalCount > MAX_AMOUNT_MATCHES) {
      // Step 3: Delete all entries with the given movieId
      await MovieEntry.deleteMany({ movieId: movieId });

      return res.status(200).json({ message: 'Movie votes reset (entries deleted)' });
    }

    // If total count is 5 or less, do nothing
    return res.status(200).json({ message: 'Movie votes do not exceed 5, no reset needed' });

  } catch (error) {
    return res.status(500).json({ error: 'Error resetting movie votes' });
  }
},


searchMovie: async (req, res) => {
  const { title } = req.query;
  try {
      const movies = await movieService.searchMovieByTitle(title);
      res.json(movies);
  } catch (error) {
      if (error.response) {
          // Error response from TMDb
          res.status(error.response.status).json({ error: error.response.data.status_message });
      } else if (error.request) {
          // No response received
          res.status(503).json({ error: 'Service unavailable. Please try again later.' });
      } else {
          // Other errors
          res.status(400).json({ error: 'Invalid request. Please check your input.' });
      }
  }
},

getMovieDetails: async (req, res) => {
  const { movieId } = req.params;
  try {
      const movieDetails = await movieService.getMovieDetails(movieId);
      res.json(movieDetails);
  } catch (error) {
      if (error.response) {
          // Error response from TMDb
          res.status(error.response.status).json({ error: error.response.data.status_message });
      } else if (error.request) {
          // No response received
          res.status(503).json({ error: 'Service unavailable. Please try again later.' });
      } else {
          // Other errors
          res.status(400).json({ error: 'Invalid request. Please check your input.' });
      }
  }
}

};


module.exports = movieController;
