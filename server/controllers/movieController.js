const express = require("express");
const mongoose = require("mongoose");
const movieService = require('../services/movieService');

const User = require('../models/user');

const movieController = {

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

};


module.exports = movieController;
