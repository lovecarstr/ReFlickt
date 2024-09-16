const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,  
        trim: true     
    },
    password: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,  
        match: [/.+\@.+\..+/, 'Please fill a valid email address'],  // Simple email validation
    },
    tokens: {
        type: Number,
        default: 5,  // Start users off with 5 tokens
    },
    watchedMovies: [{
        type: String
    }],
    currentMatch: { // The current movie a user is matched with.
        type: Schema.Types.ObjectId,
        ref: 'MovieMatch',
        default: null 
    }
}, {
    timestamps: true 
});

const User = mongoose.model('User', userSchema);

module.exports = User;