const express = require('express');
const mongoose = require('mongoose');
const movieService = require('../services/movieService');

const User = require('../models/user');
const MovieMatch = require('../models/movieMatch');
const Message = require('../models/message');
const Discussion = require('../models/discussion');


const createNewDiscussion = async (req, res) => {
    const { matchId } = req.body; 

    try {
        const movieMatch = await MovieMatch.findById(matchId);

        if (!movieMatch) {
            return res.status(404).json({ error: 'Movie match not found' });
        }

        // Fetch movie details using the movieId from MovieMatch
        const movieDetails = await movieService.getMovieDetails(movieMatch.movieId);


        // Create a new discussion with the fetched movie details
        const newDiscussion = new Discussion({
            participants: [movieMatch.firstUserId, movieMatch.secondUserId],
            movieId: movieDetails.movieId, // Use the correct movieId
            messages: [], // No messages in a brand new conversation
            discussionName: `${movieDetails.title} Discussion`, // Names the conversation after the movie 
        });

        const savedDiscussion = await newDiscussion.save(); 

        res.status(201).json({ message: 'New discussion created successfully', newDiscussion: savedDiscussion });
    } catch (error) {
        res.status(500).json({ error: 'Error creating new discussion', details: error.message });
    }
};

const createNewMessage = async (req, res) => {
    const { userId, discussionId, content } = req.body;

    try {
        const userExists = await User.findById(userId);
        if (!userExists) {
            return res.status(404).json({ error: 'Sender not found' });
        }

        const newMessage = new Message({
            content: content,
            sender: userId, 
        });

        await newMessage.save();

        // Find the discussion and push the new message to its messages array
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        discussion.messages.push(newMessage._id); // Push only the message ID if messages are referenced
        await discussion.save();

        res.status(201).json({ newMessage });
    } catch (error) {
        res.status(500).json({ error: 'Error creating new message', details: error.message });
    }
};

// get a all user discussion. TODO: Maybe populate?
const getAllUserDiscussions = async (req, res) => {
    const userId = req.params.userId;
    
    try {
        const user = await User.findById(userId); // Check if user exists
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Find discussions where the user is a participant
        const discussions = await Discussion.find({ participants: userId });

        if (discussions.length === 0) {
            return res.status(404).json({ message: "No discussions found for this user." });
        }

        // Sends all the discussions
        res.status(200).json({ discussions });
    } catch (error) {
        res.status(500).json({ error: 'Error when getting discussions' });
    }
};

//get all discussions from a movie
const getAllMovieDiscussions = async (req, res) => {
    const movieId = Number(req.params.movieId);

    try {
        // Find discussions related to the specified movieId
        const discussions = await Discussion.find({ movieId: movieId });

        if (discussions.length === 0) {
            return res.status(404).json({ message: "No discussions found for this movie." });
        }

        // Send all the discussions
        res.status(200).json({ discussions });
    } catch (error) {
        res.status(500).json({ error: 'Error when getting discussions' });
    }
};

//get a specific discussion
const getDiscussion = async (req, res) => {
    const { discussionId } = req.params;

    try {
        // Fetch the discussion and populate the 'messages' and 'participants' fields
        const discussion = await Discussion.findById(discussionId)
            .populate('messages')  
            .populate('participants', 'username'); 

        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        res.status(200).json(discussion);
    } catch (error) {
        res.status(500).json({ error: 'Error fetching discussion', details: error.message });
    }
};

const getLatestMessage = async (req, res) => {
    const { discussionId } = req.params; 

    try {
        // Fetch the discussion by ID and populate the 'messages' field
        const discussion = await Discussion.findById(discussionId)
            .select('messages') // Only select the 'messages' field
            .populate({
                path: 'messages',
                options: { sort: { createdAt: -1 }, limit: 1 } 
            });

        if (!discussion || discussion.messages.length === 0) {
            return res.status(404).json({ message: "Discussion not found or it is empty" });
        }

        // Return the first (most recent) message after sorting
        const latestMessage = discussion.messages[0];

        res.status(200).json({ latestMessage });
    } catch (error) {
        res.status(500).json({ error: 'Error when getting the latest message', details: error.message });
    }
};


const renameDiscussion = async (req, res) => {
    const { discussionId } = req.params; 
    const { newName } = req.body;

    try {
        const discussion = await Discussion.findById(discussionId);

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        if (!newName || newName.trim().length === 0) {
            return res.status(400).json({ message: "New discussion name was not found or left blank" });
        }

        discussion.discussionName = newName;
        await discussion.save(); 

        res.status(200).json({ message: "Discussion name successfully updated", updatedDiscussion: discussion });
    } catch (error) {
        res.status(500).json({ message: "Discussion name update was unsuccessful", error: error.message });
    }
};

const deleteDiscussion = async (req, res) => {
    const {discussionId} = req.params; 

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
