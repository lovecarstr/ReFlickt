const express = require('express');
const {createNewDiscussion, getDiscussion, createNewMessage, getAllMovieDiscussions, getAllUserDiscussions, getLatestMessage, 
   renameDiscussion, deleteDiscussion, updateMessage, getNewMessages} = require('../controllers/discussionController');
const router = express.Router();

// Tested
router.post('/discussions', createNewDiscussion); // creates a new discussion
router.post('/discussions/:discussionId/messages', createNewMessage); // Creates a new message inside a specific discussion
router.get('/discussions/:discussionId', getDiscussion); // gets a specific discussion
router.get('/discussions/:discussionId/messages', getNewMessages); // gets a specific discussion
router.get('/users/:userId/discussions', getAllUserDiscussions) //gets all the discussions for a specific user
router.get('/movies/:movieId/discussions', getAllMovieDiscussions) //gets all the discussion IDs for a specific movie
router.get('/discussions/:discussionId/messages/latest', getLatestMessage) //gets the latest message from a specific discussion
router.patch('/discussions/:discussionId/rename', renameDiscussion) //renames a specific discussion
router.delete('/discussions/:discussionId', deleteDiscussion) //deletes a specific discussion

router.put('/discussions/:discussionId/messages', updateMessage)//updateMessage


//NOT IMPLEMENTED YE


/*
*/

module.exports = router;
