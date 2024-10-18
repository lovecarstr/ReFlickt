const express = require("express");
const mongoose = require("mongoose");
const movieService = require("../services/movieService");

const User = require("../models/user");

const movieController = {

  searchMovie: async (req, res) => {
    const { title } = req.query;
    try {
      const movies = await movieService.searchMovieByTitle(title);
      res.json(movies);
    } catch (error) {
      if (error.response) {
        // Error response from TMDb
        res
          .status(error.response.status)
          .json({ error: error.response.data.status_message });
      } else if (error.request) {
        // No response received
        res
          .status(503)
          .json({ error: "Service unavailable. Please try again later." });
      } else {
        // Other errors
        res
          .status(400)
          .json({ error: "Invalid request. Please check your input." });
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
        res
          .status(error.response.status)
          .json({ error: error.response.data.status_message });
      } else if (error.request) {
        // No response received
        res
          .status(503)
          .json({ error: "Service unavailable. Please try again later." });
      } else {
        // Other errors
        res
          .status(400)
          .json({ error: "Invalid request. Please check your input." });
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
        res
          .status(error.response.status)
          .json({ error: error.response.data.status_message });
      } else if (error.request) {
        // No response received
        res
          .status(503)
          .json({ error: "Service unavailable. Please try again later." });
      } else {
        // Other errors
        res
          .status(400)
          .json({ error: "Invalid request. Please check your input." });
      }
    }
  },
};

module.exports = movieController;
