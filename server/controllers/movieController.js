const express = require("express");
const mongoose = require("mongoose");
const movieService = require('../services/movieService');

const User = require('../models/user');
const MovieEntry = require('../models/movieEntry');
const MovieMatch = require('../models/movieMatch');
const MovieRating = require('../models/movieRating');

const MOVIE_WATCH_WINDOW = 48 * 60 * 60 * 1000; // 48 hours in milliseconds
const MAX_AMOUNT_MATCHES = 5; // The maximum number of matches that are allowed to be created before movie entries are deleted
const HOURS_BETWEEN_TOKEN_REFILLS = 24;
const DAILY_TOKEN_AMOUNT = 5;
const TIME_BETWEEN_ROLLS = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
const TIME_LIMIT_FOR_RESERVATION = 5 * 60 * 1000; // 5 minutes in milliseconds


const movieController = {

// Checks open matches to find a movie for a user to be matched with. If there are no 
// open matches, it will instead select a random one from the list of entries not yet matched with any users.
getRandomMovie: async (req, res) => {
  const { userId } = req.query; // Retrieve userId from query parameters

  try {
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
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
          message: `You need to wait ${remainingHours.toFixed(2)} more hours before rolling again.`
        });
      }
    }

    // Check for open matches that are not reserved or have expired
    const openMatch = await MovieMatch.findOne({
      status: 'Open',
      $or: [
        { reservedBy: null }, // Not reserved
        { reservationExpiresAt: { $lt: now } } // Expired reservations
      ]
    });

    if (openMatch) {
      const watchedMovies = user.watchedMovies;

      // Check if the user has already watched the movie in the open match
      if (!watchedMovies.includes(openMatch.movieId)) {
        // Reserve this match for the user
        openMatch.reservedBy = userId;
        openMatch.reservationExpiresAt = new Date(now.getTime() + TIME_LIMIT_FOR_RESERVATION);
        await openMatch.save();

        // Update the currentMovieRoll with the matchId and canRollAgainAt
        user.currentMovieRoll = {
          movieId: openMatch.movieId,
          matchId: openMatch._id,
          canRollAgainAt: new Date(Date.now() + TIME_BETWEEN_ROLLS) // Update with the cooldown period
        };
        await user.save();

        // Return the movie ID and match ID
        return res.status(200).json({
          movieId: openMatch.movieId,
          matchId: openMatch._id
        });
      }
    }

    // Fallback: No open matches or all matches are watched by the user
    const randomEntry = await MovieEntry.aggregate([{ $sample: { size: 1 } }]);

    if (randomEntry.length > 0) {
      // Update the currentMovieRoll for a random movie
      user.currentMovieRoll = {
        movieId: randomEntry[0].movieId,
        matchId: null, // No match for random movie
        canRollAgainAt: new Date(Date.now() + TIME_BETWEEN_ROLLS) // Update with the cooldown period
      };
      await user.save();

      return res.status(200).json({ movieId: randomEntry[0].movieId });
    }

    return res.status(404).json({ message: 'No movies available' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
},


// Creates a new, open match for a user with a movie.
createNewMatch: async (req, res) => {
    const { userId } = req.body;

    try {

      const user = await User.findById(userId);
      if (!user){
        res.status(404).json({message: 'User not found'});
      }

      const newMatch = new MovieMatch({
        movieId: user.currentMovieRoll.movieId,  
        firstUserId: userId, 
        secondUserId: null,
        status: 'Open'
      });

        // Increment the matchCount for the movie entry, so that its votes can be reset after the threshold.
        await MovieEntry.findOneAndUpdate(
            { movieId: user.currentMovieRoll.movieId },
            { $inc: { matchCount: 1 } }
        );

        await newMatch.save();
        user.currentMatch = newMatch;
        await user.save();
        res.status(201).json({ message: 'New match created', match: newMatch });
    } catch (error) {
        res.status(500).json({ error: 'Error creating new match' });
    }
},

// Matches a second user to an open match, and sets its status to closed.
addUserToMatch: async (req, res) => {
  const { userId } = req.body; 
  const { matchId } = req.params; 

  try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      const match = await MovieMatch.findById(matchId);
      if (!match) {
          return res.status(404).json({ error: 'Match not found' });
      }

      // Check if the match has expired
      const now = new Date();
      const reservationExpiresAt = match.reservationExpiresAt;

      if (reservationExpiresAt && now > reservationExpiresAt) {
          return res.status(400).json({ message: 'Match has expired' });
      }

      // Check if the match already has two users
      if (match.secondUserId) {
          return res.status(400).json({ error: 'Match already has two users' });
      }

      // Set the second user and calculate expiration
      match.secondUserId = userId;
      match.status = 'Closed';
      match.watchWindowExpiresAt = new Date(Date.now() + MOVIE_WATCH_WINDOW); // Set the watch window end time

      await match.save();
      
      user.currentMatch = matchId; // Optionally update the user with the current match
      await user.save();

      res.status(200).json({ message: 'User added to match', match });
  } catch (error) {
      console.error(error); // Log the error for debugging
      res.status(500).json({ error: 'Error adding user to match' });
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

// Spends tokens to add movies to the movieEntries collection
addMovieEntry: async (req, res) => {
    const { userId, movieId, movieTitle, moviePoster, tokens } = req.body; 

    try {
        const user = await User.findById(userId);

        // Check if the user has enough tokens
        if (tokens > user.tokens) {
            return res.status(400).json({ message: 'Not enough tokens' });
        }

        // User must spend at least 1 token
        if (tokens < 1){
          return res.status(400).json({ message: 'At least 1 token is required to vote' });
        }

        for (let i = 0; i < tokens; i++) {
            const entry = new MovieEntry({
                movieId: movieId,
                movieTitle: movieTitle,
                moviePoster: moviePoster

            });
            await entry.save();  // Save each entry in the database
            user.tokens -= 1; // Decrement tokens by one for each vote
        }
        await user.save();

        res.status(201).json({ message: 'Movie entries added successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error adding movie entries' });
    }
},

updateCurrentUserMatch: async (req, res) => {
  const { userId, matchId } = req.params; 

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
  const { movieId, userId, recommendation, story, performances, directing, visuals, sound } = req.body;
  
  try {

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

updateMovieRating: async (req, res) => {
  const { ratingId } = req.params; // Get ratingId from the route parameters
  const { story, performances, directing, visuals, sound, recommendation } = req.body;

  try {
    // Find and update the movie rating by ratingId
    const updatedRating = await MovieRating.findByIdAndUpdate(
      ratingId,
      { story, performances, directing, visuals, sound, recommendation },
      { new: true } 
    );

    if (!updatedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    return res.status(200).json(updatedRating);
  } catch (error) {
    return res.status(500).json({ error: 'Error updating rating', details: error.message });
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
      { $group: { _id: { movieId: '$movieId', movieTitle: '$movieTitle', moviePoster: '$moviePoster' }, voteCount: { $sum: 1 } } }, // Group by movieId, movieTitle, and moviePoster
      { $sort: { voteCount: -1 } }, // Sort descending by vote count
      {
        $project: {
          movieId: '$_id.movieId', // Project movieId from the group
          movieTitle: '$_id.movieTitle', // Project movieTitle from the group
          moviePoster: '$_id.moviePoster', // Project moviePoster from the group
          voteCount: 1,
          _id: 0 // Remove the original _id field
        }
      }
    ]);

    return res.status(200).json(movieVotes);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching movie votes' });
  }
},

getMovieVotes: async (req, res) => {
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

// Check if the watch window is still open for the current match of a specific user
checkWatchWindow: async (req, res) => {
  const { userId } = req.params; 

  try {
      const user = await User.findById(userId);
      if (!user || !user.currentMatch) {
          return res.status(404).json({ error: 'User or current match not found' });
      }

      const matchId = user.currentMatch;

      const match = await MovieMatch.findById(matchId);
      if (!match) {
          return res.status(404).json({ error: 'Match not found' });
      }

      // Check if the watch window has expired
      if (match.watchWindowExpiresAt) {
          const expired = Date.now() > new Date(match.watchWindowExpiresAt).getTime();
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
  try {
    // Step 1: Aggregate the total matchCount for each movieId
    const movieVoteSums = await MovieEntry.aggregate([
      { 
        $group: { 
          _id: '$movieId', 
          totalMatchCount: { $sum: '$matchCount' }  // Sum the matchCount for each movieId
        } 
      }
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
    return res.status(200).json({ message: 'Movie votes reset where applicable.' });

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
},

getMovieBasicInfo: async (req, res) => {
  const { movieId } = req.params;
  try {
      const movieBasicInfo = await movieService.getMovieBasicInfo(movieId);
      res.json(movieBasicInfo);
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

refillUserTokens: async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const now = new Date();
    const hoursSinceLastRefill = (now.getTime() - user.tokensRefilled.getTime()) / (1000 * 60 * 60);

    // Check if correct amount of hours have passed since the last refill
    if (hoursSinceLastRefill >= HOURS_BETWEEN_TOKEN_REFILLS) {
      user.tokens = DAILY_TOKEN_AMOUNT;  
      user.tokensRefilled = now;  // This if off by 2 hours currently
      await user.save();  

      return res.status(200).json({ message: 'Tokens refilled', tokens: user.tokens });
    } else {
      const hoursLeft = HOURS_BETWEEN_TOKEN_REFILLS - hoursSinceLastRefill;
      return res.status(400).json({ message: `Tokens refill not available yet. Try again in ${hoursLeft.toFixed(2)} hours.` });
    }

  } catch (error) {
    return res.status(500).json({ error: 'Error refilling tokens' });
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

getAllRatings: async (req, res) => {
  const { movieId } = req.query; // Optional query parameter

  try {
    const query = movieId ? { movieId } : {}; // Filter by movieId if provided
    const ratings = await MovieRating.find(query);
    return res.status(200).json(ratings);
  } catch (error) {
    return res.status(500).json({ error: 'Error fetching ratings' });
  }
},

deleteAllEntries: async (req, res) => {
  try {
    await MovieEntry.deleteMany();
    return res.status(200).json({ message: 'All entries deleted successfully' });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting movie entries' });
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

deleteMovieRating: async (req, res) => {
  const { ratingId } = req.params; 

  try {
    // Find and delete the movie rating by ID
    const deletedRating = await MovieRating.findByIdAndDelete(ratingId);

    // If the rating was not found
    if (!deletedRating) {
      return res.status(404).json({ error: 'Rating not found' });
    }

    // Return success message
    return res.status(200).json({ message: 'Rating deleted successfully', deletedRating });
  } catch (error) {
    return res.status(500).json({ error: 'Error deleting rating', details: error.message });
  }
},

 deleteWatchedMovieFromUser: async (req, res) => {
  const { userId, movieId } = req.params;

  try {
      // Find the user by ID
      const user = await User.findById(userId);

      if (!user) {
          return res.status(404).json({ error: 'User not found' });
      }

      // Check if the movie exists in the watchedMovies array
      const movieIndex = user.watchedMovies.indexOf(movieId);

      if (movieIndex === -1) {
          return res.status(404).json({ error: 'Movie not found in user\'s watched list' });
      }

      // Remove the movie from the watchedMovies array
      user.watchedMovies.splice(movieIndex, 1);

      // Save the updated user
      await user.save();

      res.status(200).json({ message: 'Movie removed from user\'s watched list successfully' });
  } catch (error) {
      res.status(500).json({ error: 'Error removing movie from watched list', details: error.message });
  }
}

};


module.exports = movieController;
