const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieMatchSchema = new Schema({
    movieId: {
        type: String,
        required: true,
    },
    firstUserId: { 
        type: String,
        required: true,
    },
    secondUserId: { 
        type: String,
    },
    status: {
        type: String,
        enum: ['Open', 'Closed'], // Only allows 'Open' or 'Closed'
        required: true 
    }
}, {
    timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
});

const MovieMatch = mongoose.model('MovieMatch', movieMatchSchema);

module.exports = MovieMatch;