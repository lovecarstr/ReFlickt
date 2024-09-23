const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    content: {
        type: String,
        required: true 
    },
    sender: {
        userID: String,
        required: true
    },
    discussionId: {
        type: int,
        required: true
    }
},{
    timestamps: true //automatically creates timestamps. 
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;