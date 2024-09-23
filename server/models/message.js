const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const User = require('../models/user');
const Discussion = require('../models/discussion'); 

const messageSchema = new Schema({
    content: {
        type: String,
        required: true, 
    },
    sender: {
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
}, {
    timestamps: true // Automatically creates timestamps. 
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;