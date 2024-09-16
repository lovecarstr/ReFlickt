const express = require('express');
const mongoose = require('mongoose');

const Movie = require('../models/movie');
const MovieEntry = require('../models/movieEntry');
const MovieMatch = require('../models/movieMatch');

// This method checks open matches to find a movie for a user to be matched with. If there are no 
// open ones, it will instead select a random one from the list of entries not yet matched with anyone
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

const createNewMatch = async (req, res) => {
    const { movieId, firstUserId } = req.body;

    try {
        const newMatch = new MovieMatch({
            movieID: movieId,
            firstUserID: firstUserId,
            status: 'Open'
        });

        // Increment the count for the movie entry
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

const addUserToMatch = async (req, res) => {
    const { matchId, secondUserId } = req.body;

    try {
        const match = await MovieMatch.findById(matchId);

        match.secondUserID = secondUserId;
        match.status = 'Closed';

        await match.save();

        res.status(200).json({ message: 'User added to match', matchId: match._id });
    } catch (error) {
        res.status(500).json({ error: 'Error adding user to match' });
    }
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

module.exports = { getRandomMovie, createNewMatch, addUserToMatch };