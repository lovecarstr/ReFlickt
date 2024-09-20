const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
    participants: [{        
        type: String, // user ID    
        required: true    
    }],
    movie:{
        movieID: String,
        required: true,
    },
    messages: 
        [messageSchema], // May need import?

    discussionName: {        
        type: String,        
        default: 'Unnamed Discussion' 
    },
},{
    timestamps: true //automatically creates timestamps. 
});

const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;