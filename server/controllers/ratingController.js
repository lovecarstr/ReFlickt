const express = require("express");
const mongoose = require("mongoose");

const User = require("../models/user");
const MovieRating = require("../models/movieRating");

const ratingController = {
  rateMovie: async (req, res) => {
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

  deleteMovieRating: async (req, res) => {
    const { ratingId } = req.params;

    try {
      // Find and delete the movie rating by ID
      const deletedRating = await MovieRating.findByIdAndDelete(ratingId);

      // If the rating was not found
      if (!deletedRating) {
        return res.status(404).json({ error: "Rating not found" });
      }

      // Return success message
      return res
        .status(200)
        .json({ message: "Rating deleted successfully", deletedRating });
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error deleting rating", details: error.message });
    }
  },

  getAllRatings: async (req, res) => {
    const { movieId } = req.query; // Optional query parameter

    try {
      const query = movieId ? { movieId } : {}; // Filter by movieId if provided
      const ratings = await MovieRating.find(query);
      return res.status(200).json(ratings);
    } catch (error) {
      return res.status(500).json({ error: "Error fetching ratings" });
    }
  },

  updateMovieRating: async (req, res) => {
    const { ratingId } = req.params; // Get ratingId from the route parameters
    const { story, performances, directing, visuals, sound, recommendation } =
      req.body;

    try {
      // Find and update the movie rating by ratingId
      const updatedRating = await MovieRating.findByIdAndUpdate(
        ratingId,
        { story, performances, directing, visuals, sound, recommendation },
        { new: true }
      );

      if (!updatedRating) {
        return res.status(404).json({ error: "Rating not found" });
      }

      return res.status(200).json(updatedRating);
    } catch (error) {
      return res
        .status(500)
        .json({ error: "Error updating rating", details: error.message });
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

  // GET a specific users movie ratings
  getUserRatings: async (req, res) => {
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
  },
};

module.exports = ratingController;
