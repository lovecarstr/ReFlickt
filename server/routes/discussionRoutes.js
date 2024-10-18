const express = require('express');
const {createNewDiscussion, getDiscussion, createNewMessage, getAllMovieDiscussions, getAllUserDiscussions, getLatestMessage, 
   renameDiscussion, deleteDiscussion, updateMessage, getNewMessages, addUserToDiscussion, deleteMessage, getDiscussionMessages} = require('../controllers/discussionController');
const router = express.Router();

// UNCATEGORIZED
router.get('/discussions/:discussionId/messages/latest', getLatestMessage) //gets the latest message from a specific discussion
router.patch('/discussions/:discussionId/rename', renameDiscussion) //renames a specific discussion

// POST (relationship)
router.post('/discussions/:discussionId/messages', createNewMessage); // Creates a new message inside a specific discussion

// POST (collection)
router.post('/discussions', createNewDiscussion); // creates a new discussion

// PATCH (individual)
router.patch('/discussions/:discussionId', addUserToDiscussion); // adds user to discussion 

// GET (individual)
router.get('/discussions/:discussionId', getDiscussion); // gets a specific discussion

// GET (collection)
router.get('/discussions/:discussionId/messages', getDiscussionMessages); // gets a specific discussion

// GET (relationship)
router.get('/users/:userId/discussions', getAllUserDiscussions) //gets all the discussions for a specific user
router.get('/movies/:movieId/discussions', getAllMovieDiscussions) //gets all the discussion IDs for a specific movie
router.get('/discussions/:discussionId/messages', getNewMessages); // gets a specific discussion

// DELETE (individual)
router.delete('/discussions/:discussionId', deleteDiscussion) //deletes a specific discussion
router.delete('/discussions/:discussionId/messages/:messageId', deleteMessage)

// PUT (individual)
router.put('/messages/:messageId', updateMessage)//updateMessage



module.exports = router;
