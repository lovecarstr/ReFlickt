const express = require('express');
const mongoose = require('mongoose');

const Movie = require('../models/movie');
const User = require('../models/user');
const MovieMatch = require('../models/movieMatch');
const Message = require('../models/message');
const Discussion = require('../models/discussion');

const newDiscussion = async(req, res) => {
    const {discussionID, discussionName, movieID, senderID, receiverID} = req.body;

    try {
        const newDiscussion = new Discussion ({
            participants: {senderID, receiverID},
            movie: movieID,
            discussionID: discussionID,
            messages: {},
            discussionName: discussionName,
        })
        res.status(201).json({message: 'new discussion created successfully', discussion: newDiscussion}); 
    }
    catch (error){
        res.status(500).json({ error: 'Error creating new discussion' });
    }
}

//get a specific discussion
const getDiscussion = async (req, res) => {
    const discussionID = req.params.discussionID;
    try {
        const discussion = await Discussion.findById({discussionID});
        if(!discussion) {
            return res.status(404).json({ message: "Discussion not found" });
        }
        res.status(200).json(discussion);
    }
    catch (error){
        res.status(500).json({ error: 'Error creating fetching conversation' });
    }
}

const newMessage = async (req, res) => {
    const {senderID, receiverID, discussionID, content } = req.body
    
    try {
        const newMessage = new Message ({
            content: content,
            sender: senderID,
            receiver: receiverID,
            
        });
    }
    catch (error) {
        res.status(500).json({ error: 'Error creating new message' });
    }
}
