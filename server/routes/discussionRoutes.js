const express = require('express');
const {createNewDiscussion, getDiscussion, createNewMessage, getAllMovieDiscussions, getAllUserDiscussions, getLatestMessage
   } = require('../controllers/discussionController');
const router = express.Router();

//UNTESTED
router.post('/discussions/start', createNewDiscussion); // creates a new discussion
router.post('/discussions/:discussionId/message', createNewMessage); // Creates a new message inside a specific discussion
router.get('/discussions/:discussionId', getDiscussion); // gets a specific discussion
router.get('/users/:userId/discussions', getAllUserDiscussions) //gets all the discussion IDs for a specific user
router.get('/movies/:movieId/discussions', getAllMovieDiscussions) //gets all the discussion IDs for a specific movie
router.get('/discussions/:discussionId/latest', getLatestMessage) //gets the latest message from a specific discussion

//TESTED

//NOT IMPLEMENTED YET


/*
*/

