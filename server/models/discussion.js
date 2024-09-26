const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = require('../models/message'); 

const discussionSchema = new Schema({
    participants: [{        
        type: Schema.Types.ObjectId, // Change to ObjectId for User references
        ref: 'User', // Reference to the User model
        required: true    
    }],
    movieId: {
        type: Number,
        required: true,
    },
    messages: [{
        type: Schema.Types.ObjectId, 
        ref: 'Message' 
    }],
    discussionName: {        
        type: String,        
        default: 'Unnamed Discussion' 
    },
}, {
    timestamps: true // Automatically creates timestamps. 
});

const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;