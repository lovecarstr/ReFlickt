const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const discussionSchema = new Schema({
    Message: 
}, {
    timestamps: true // Automatically creates timestamps. 
});

const Discussion = mongoose.model("Discussion", discussionSchema);

module.exports = Discussion;