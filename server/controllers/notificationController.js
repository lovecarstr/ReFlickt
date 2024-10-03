const express = require('express');
const mongoose = require('mongoose');

const User = require('../models/user');  // Adjust the path to wherever your User model is defined
const Discussion = require('../models/discussion');

const getUserNotifications = async (req, res) => {
    const userId = req.params.userID;
    try{
      const user = await User.findById(userId).populate('notifications');; // Check if user exists
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      } 
      if (user.notifications.length === 0){
        return res.status(200).json({ message: "No notifications found", notifications: [] });
      }
  
      res.status(200).json({notifications: user.notifications});
    } catch(error){
      res.status(500).json({error: error.message})
    }
  }
  
  const markNotificationsAsRead = async (req, res) => {
    const {discussionId, userId} = req.body;
    try{
      const user = await User.findById({_id: userId})
      if (!user) {
        res.status(404).json({message: "No user was found"})
      } 
  
      const notifications = user.notifications; 
      if (notifications.length === 0 || !notifications){
        res.status(404).json({message: "No nofications found"})
      }
  
      discussionNotifications = notifications.filter(
        (notifications) => notifications.discussionId.toString() === discussionId
      );
      if (discussionNotifications.length === 0 || !discussionNotifications){
        res.status(404).json({message: "No nofications found for this discussion"})
      }
  
      for (const notification of discussionNotifications){
        notification.status = false;
        await notification.save(); 
      }
      res.status(200).json({message: "notification successfully markes as read"})
    } catch (error){
      res.status(500).json({ error: 'Error marking notifications as read', details: error.message });
    }
  }
  
  const createDiscussionNotification = async (req, res) => {
    const { userId, discussionId } = req.body;
  
    try {
      const discussion = Discussion.findById({_id: discussionId})
  
      if (!discussion) {
        return res.status(404).json({ error: 'Discussion not found' });
      }
      firstUserId = discussion.participants.firstUserId;
      secondUserId = discussion.participants.secondUserId
  
      const messages = dicussion.messages;
      
      if (messages.lenght === 0) {
        firstUser = await User.findById({_id: firstUser})
        secondUser = await User.findById({_id: secondUser})
  
          const newDiscussionMessage = new Message ({
              content: "New discussion has been created for your latest match",
              sender: discussionId, 
          })
  
          await newDiscussionMessage.save();
  
          const notification = new Notification({
              message: newDiscussionMessage,
              discussion: discussionId,
          })
          await notification.save();
          secondUser.notifications.push(notification._id);
          firstUser.notifications.push(notification._id);
  
          secondUser.save();
          firstUser.save();
  
          res.status(200).json({Message: "Successfully sent notification." });
      }
    } catch (error){
      res.status(500).json({Message: "could not create message", error: error.details})
    }
  }
  
const createMessageNotification = async (req, res) => {
   {discussionId, messageId, sendingUserId} 

    try{

            // Find the discussion and push the new message to its messages array
        const discussion = await Discussion.findById({_id: discussionId});
        if (!discussion) {
            return res.status(404).json({ error: 'Discussion not found' });
        }
        const message = await Discussion.findById({_id: messageId});
        if (!message) {
            return res.status(404).json({ error: 'Discussion not found' });
        }

        const notification = new Notification({
            message: messageId,
            discussion: discussionId,
        })

        await notification.save();

        if (discussion.firstUserId.toString() === sendingUser._id.toString()) {
            const secondUser = await User.findById(discussion.secondUserId);
            if (secondUser) {
                secondUser.notifications.push(notification._id);
                await secondUser.save();
            }
        } else if (discussion.secondUserId.toString() === sendingUser._id.toString()) {
            const firstUser = await User.findById(discussion.firstUserId);
            if (firstUser) {
                firstUser.notifications.push(notification._id);
                await firstUser.save();
            }
        } else {
            return res.status(404).json({ message: 'Notification could not be sent' });
        }
    } catch (error) {
        res.status(500).json({message: "Could not send notification", error: error.details})
    }
}



module.exports = {getUserNotifications, markNotificationsAsRead, createDiscussionNotification, createMessageNotification}