const express = require("express");
const mongoose = require("mongoose");

const Movie = require("../models/movie");
const MovieEntry = require("../models/movieEntry");
const MovieMatch = require("../models/movieMatch");
const MovieRating = require("../models/movieRating");
const User = require("../models/user");

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

const getRandomMovie = async (req, res) => {};

const createMovieMatch = async (req, res) => {};

const getCurrentUserMatch = async (req, res) => {};

const spendTokens = async (req, res) => {};

const getRemainingUserTokens = async (req, res) => {};

const getMovieOdds = async (req, res) => {};

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

module.exports = { rateMovie, getMovieRatings, getUserMovieRating };
