const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const chatSchema = new Schema({
    participants: [{        
        type: String, // user ID    
        required: true    
    }],
    messages: 
        [messageSchema], // May need import?
       
    chatName: {        
        type: String,        
        default: 'Unnamed Chat' 
    }    
},{
    timestamps: true //automatically creates timestamps. 
});

const Chat = mongoose.model('Chat', chatSchema);

module.exports = Chat;