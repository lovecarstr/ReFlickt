const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Message = require('../models/message'); 

const discussionSchema = new Schema({
    firstUser: {
        type: Schema.Types.ObjectId, // Use ObjectId to reference User
        ref: "User",
        required: true,
    },
    secondUser: {
        type: Schema.Types.ObjectId, // Use ObjectId to reference User
        ref: "User",
        default: null,
    },
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