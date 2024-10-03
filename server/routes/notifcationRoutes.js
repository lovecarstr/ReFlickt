const express = require('express');
const { getUserRatings, getUserNotifications, markNotificationsAsRead, createDiscussionNotification, createMessageNotification} = require('../controllers/notificationController');;
const router = express.Router();

router.get('/users/:userId/ratings', getUserRatings); // Retrieves ratings from a specific user
router.get('/users/:userId/notifications', getUserNotifications); //Retrives a specific users notifications
router.put('/users/:userId/notifications/:discussionId', markNotificationsAsRead) //marks all notifications for a specific discussion as read. 

router.post('/discussions/:discussionId/:userId', createDiscussionNotification) // makes a notification that a new discussion has been made. 
router.post('/users/:userId/notifications', createMessageNotification);

module.exports = router;