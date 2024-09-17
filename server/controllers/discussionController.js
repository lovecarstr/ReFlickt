const express = require('express');
const mongoose = require('mongoose');

const Movie = require('../models/movie');
const User = require('../models/user');
const MovieMatch = require('../models/movieMatch');
const Message = require('../models/message');
const Discussion = require('../models/discussion');

const createNewDiscussion = async(req, res) => {
    const {discussionID, discussionName, movieID, senderID, receiverID} = req.body;

    try {
        const newDiscussion = new Discussion ({
            participants: {senderID, receiverID},
            movie: movieID,
            discussionID: discussionID,
            messages: {},
            discussionName: discussionName,
        })
        res.status(201).json({message: 'new discussion created successfully', newDiscussion: start}); 
    }
    catch (error){
        res.status(500).json({ error: 'Error creating new discussion' });
    }
}

const createNewMessage = async (req, res) => {
    const {senderID, discussionID, content } = req.body
    
    try {
        
        //Creates a new message
        const newMessage = new Message ({
            content: content,
            sender: senderID,
            discussionID: discussionID,
        });
        
        //saves the message in the discussion
        const discussion = await Discussion.findById(discussionID)

        discussion.messages.push(newMessage)

        await discussion.save();

        res.status(201).json({newMessage})
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating new message' });
    }
}

//get a all user discussion
const getAllUserDiscussions = async (req, res) => {
    const userID = req.params.userID;
    try {
        const user = await User.findById(userId); // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        const discussions = await Discussion.find({ userId })
        if (discussions.length === 0){
            return res.status(404).json({message: "no disscusions found for this user."})
        }

        //sends all the discussions
        res.status(200).json({ discussions });
    }
    catch (error){
        res.status(500).json({ error: 'Error when getting discussions' });
    }
}

//get all discussions from a movie
const getAllMovieDiscussions = async (req, res) => {
    const movieID = req.params.movieID;
    try {
        const movie = await User.findById(movieID); // Check if movie exists
        if (!movie) {
            return res.status(404).json({ message: "movie not found" });
        }
        const discussions = await Discussion.find({ movieID })
        if (discussions.length === 0){
            return res.status(404).json({message: "no disscusions found for this user."})
        }

        //sends all the discussions
        res.status(200).json({ discussions });
    }
    catch (error){
        res.status(500).json({ error: 'Error when getting discussions' });
    }
}

//get a specific discussion
const getDiscussion = async (req, res) => {
    const discussionID = req.params.discussionID;
    try {
        const discussion = await User.findById(discussionID); // Check if discussion exists
        if (!discussion) {
            return res.status(404).json({ message: "discussion not found" });
        }
        //sends all the discussions
        res.status(200).json({ discussions });
    }
    catch (error){
        res.status(500).json({ error: 'Error when getting discussions' });
    }
}

module.exports = {getAllMovieDiscussions, getAllUserDiscussions, createNewDiscussion, createNewMessage, getDiscussion};
