const express = require('express');
const mongoose = require('mongoose');

const Movie = require('../models/movie');
const MovieEntry = require('../models/movieEntry');
const MovieMatch = require('../models/movieMatch');

const getRandomMovie = async (userId) => {
    // Check for open matches
    const openMatch = await MovieMatch.findOne({ status: 'Open' });
    
    if (openMatch) {
        // Check if the user has watched the movie
        const user = await User.findById(userId);
        const watchedMovies = user.watchedMovies; // Assuming this is an array of movie IDs

        if (!watchedMovies.includes(openMatch.movieID)) {
            // Return the movie ID and match ID
            return {
                movieId: openMatch.movieID,
                matchId: openMatch._id
            };
        }
    }

    // Fallback: No open matches or all are closed
    const randomEntry = await MovieEntry.aggregate([{ $sample: { size: 1 } }]); // Randomly select one entry
    if (randomEntry.length > 0) {
        return { movieId: randomEntry[0]._id }; // Return only movieId
    }

    throw new Error('No movies available'); // Handle case where no movie is found
};

const createMovieMatch = async (req, res) => {
    
};

const updateCurrentMatch = async (req, res) => {
    
};

const getCurrentUserMatch = async (req, res) => {

};

const addMovieEntry = async (req, res) => {

};

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

module.exports = {getRandomMovie};