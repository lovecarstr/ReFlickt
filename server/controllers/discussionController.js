const express = require('express');
const mongoose = require('mongoose');

const Movie = require('../models/movie');
const User = require('../models/user');
const MovieMatch = require('../models/movieMatch');
const Message = require('../models/message');
const Discussion = require('../models/discussion');

const createNewDiscussion = async(req, res) => {
    const {MovieMatch} = req.body; 

    const movie = Movie.findOne({ movieId: MovieMatch.movieId }); //finds the movie in the database
    try {
        const newDiscussion = new Discussion ({
            participants: [MovieMatch.firstUserId, MovieMatch.secondUserId],
            movie: MovieMatch.movieId,
            messages: [], //no messages in a brand new conversation
            discussionName: movie.title + "Discussion" || "Unnamed Discussion", //names the conversation after the movie 
        })

        const savedDiscussion = await newDiscussion.save(); 

        res.status(201).json({message: 'new discussion created successfully', newDiscussion: savedDiscussion}); //new discussion created successfully
    }
    catch (error){
        res.status(500).json({ error: 'Error creating new discussion' });
    }
}

const createNewMessage = async (req, res) => {
    const {senderId, discussionId, content } = req.body
    
    try {
        
        //Creates a new message
        const newMessage = new Message ({
            content: content,
            sender: senderId,
            discussionId: discussionId,
        });
        
        //saves the message in the discussion
        const discussion = await Discussion.findById(discussionId)

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
    const userId = req.params.userId;
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
    const movieId = req.params.movieId;
    try {
        const movie = await User.findById(movieId); // Check if movie exists
        if (!movie) {
            return res.status(404).json({ message: "movie not found" });
        }
        const discussions = await Discussion.find({ movieId })
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
    const discussionId = req.params.discussionId;
    try {
        const discussion = await User.findById(discussionId); 
        if (!discussion) {// Check if discussion exists
            return res.status(404).json({ message: "discussion not found" });
        }
        //sends all the discussions
        res.status(200).json({ discussions });
    }
    catch (error){
        res.status(500).json({ error: 'Error when getting discussions' });
    }
}

const getLatestMessage = async (req, res) => {
    const discussionId = req.params.discussionId;

    try {
        const discussion = await Discussion.findOne({ discussionId })
            .select('messages') // Only fetch the 'messages' field
            .sort({ 'messages.createdAt': -1 }); // Sorts messages in descending order by 'createdAt'

        if (!discussion || discussion.messages.length === 0) {
            return res.status(404).json({ message: "discussion not found or it is empty" });
        }


        // Return the latest message (last in the array)
        const latestMessage = discussion.messages[discussion.messages.length - 1];
        
        res.status(200).json({latestMessage});
    }
    catch (error){
        res.status(500).json({ error: 'Error when getting discussions' });
    }
}
const renameDiscussion = async (req, res) => {
    const {discussionId, newName} = req.body;
    try {
        const discussion = await Discussion.findOne({ discussionId })
     
        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        } 
        if (!newName || newName.length === 0) {
            return res.status(404).json({ message: "New discussion name was not found or left blank" });
        }
        
        discussion.discussionName = newName;
        discussion.save(); 
        res.status(204).json({message: "Discussion name sucessfully updated"})
    }
    catch (error) {
        res.status(304).json({message: "Discussion name update was unsuccessfull"})
    }
}

const deleteDiscussion = async (req, res) => {
    const {discussionId} = req.params.discussionId; 

    try {
        const discussion = await Discussion.findOne({ _id: discussionId })
     
        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        } 

        await Discussion.deleteOne({ _id: discussionId })

        res.status(200).json({message: "Discussion Successfully deleted"})
    }
    catch (error){
        res.status(500).json({message: "Error deleting message"})
    }
}

module.exports = {getAllMovieDiscussions, getAllUserDiscussions, createNewDiscussion, createNewMessage, getDiscussion, getLatestMessage, renameDiscussion, deleteDiscussion};
