const express = require('express');
const mongoose = require('mongoose');
const movieService = require('../services/movieService');

const User = require('../models/user');
const MovieMatch = require('../models/movieMatch');
const Message = require('../models/message');
const Discussion = require('../models/discussion');


const createNewDiscussion = async (req, res) => {
    const { matchId, userId } = req.body; 

    try {
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const movieMatch = await MovieMatch.findById(matchId);

        if (!movieMatch) {
            return res.status(404).json({ error: 'Movie match not found' });
        }

        // Fetch movie details using the movieId from MovieMatch
        const movieDetails = await movieService.getMovieBasicInfo(movieMatch.movieId);


        // Create a new discussion with the fetched movie details
        const newDiscussion = new Discussion({
            firstUser: user._id,
            movieId: movieDetails.movieId, // Use the correct movieId
            messages: [], // No messages in a brand new conversation
            discussionName: `${movieDetails.title} Discussion`, // Names the conversation after the movie 
        });
        
        const savedDiscussion = await newDiscussion.save(); 

        movieMatch.discussion = savedDiscussion;
        await movieMatch.save()

        res.status(201).json({ message: 'New discussion created successfully', newDiscussion: savedDiscussion });
    } catch (error) {
        res.status(500).json({ error: 'Error creating new discussion', details: error.message });
    }
};
const addUserToDiscussion = async (req, res) => {
    const { discussionId } = req.params;
    const { userId } = req.body;

    try {
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }
        const discussion = await Discussion.findById(discussionId);
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        } 
        
        discussion.secondUser = user._id;

        await discussion.save();

        res.status(200).json({message: "Added user to discussion", discussion});
    } catch (error) {
        res.status(500).json({message: "Failed to add user to discussion due to server error"})
    }
}

const createNewMessage = async (req, res) => {
    const { discussionId } = req.params;
    const { userId, content } = req.body;

    try {
        const sendingUser = await User.findById(userId);
        if (!sendingUser) {
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

        res.status(201).json({ newMessage, _id:newMessage});
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
        const discussions = await Discussion.find({ $or: [{ firstUser: userId }, { secondUser: userId }]});
        

        if (discussions.length === 0) {
            return res.status(404).json({ message: "No discussions found for this user." });
        }

        // Sends all the discussions
        res.status(200).json({ discussions: Array.isArray(discussions) ? discussions : [discussions] });
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

const getNewMessages = async (req, res) => {
    try {
      const { discussionId } = req.params;
      const { afterMessageId } = req.query;
  
      if (!discussionId) {
        return res.status(400).json({ error: 'Discussion ID is required' });
      }
  
      console.log("Discussion ID:", discussionId);
      console.log("After Message ID:", afterMessageId);
  
      let query = { discussionId };
  
      if (afterMessageId) {
        const lastMessage = await Message.findById(afterMessageId);
  
        if (!lastMessage) {
          return res.status(400).json({ error: 'Invalid afterMessageId' });
        }
  
        console.log("Last Message Created At:", lastMessage.createdAt);
  
        // Create a query for messages after the latest message createdAt time
        query = {
          ...query,
          createdAt: { $gt: lastMessage.createdAt },
        };
      }
  
      console.log("Query:", query);
  
      // Fetch new messages
      const newMessages = await Message.find(query).sort({ createdAt: 1 });
  
      console.log("New Messages:", newMessages);
  
      // Send the new messages to the client
      return res.status(200).json({ messages: newMessages });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: 'Server error' });
    }
  };

//get a specific discussion
const getDiscussion = async (req, res) => {
    const { discussionId, userId} = req.params;

    try {
        // Fetch the discussion and populate the 'messages' and 'participants' fields
        const discussion = await Discussion.findById({ _id: discussionId })
            .populate('messages')  
            .populate({
                path: 'messages',
                select: 'sender content createdAt',
                populate: ({
                    path: 'sender',
                    select: 'username'
                })
              })
            .populate('firstUser', 'username')
            .populate('secondUser', 'username');
            

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
        const discussion = await Discussion.findById({ _id: discussionId })
            .select('messages') // Only select the 'messages' field
            .populate({
                path: 'messages',
                populate: {                    
                    path: 'sender',                    
                    select: 'username'               
                },
                options: { sort: { createdAt: -1 }, limit: 1 } 
            })

        if (!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }

        if (discussion.messages.length === 0){
            const latestMessage = new Message({
                content: "Be the first one to send a message :) !",
                sender: null, 
            }); 
            return res.status(200).json({latestMessage});
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
        const discussion = await Discussion.findById({ _id: discussionId });

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
const updateMessage = async (req, res) => {
    const {messageId, sender, newContent} = req.body; 
    try{
        const updatedMessage = await Message.findByIdAndUpdate({ sender, newContent },
            { new: true } )
        if (!updatedMessage) {
            return res.status(404).json({ error: 'Message not found' });
        }
        res.status(200).json ({message: "message updated", updatedMessage})
        
    } catch(error){
        res.status(500).json ({error: error.message})
    }
}

module.exports = {getAllMovieDiscussions, getAllUserDiscussions, createNewDiscussion, addUserToDiscussion, createNewMessage, getDiscussion, getLatestMessage, renameDiscussion, deleteDiscussion, updateMessage, getNewMessages};
