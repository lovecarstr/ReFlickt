const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieMatchSchema = new Schema({
    movieID: {
        typeID: int,
        required: true,
    },
    firstUserID: { 
        type: String,
        required: true,
    },
    secondUserID: { 
        type: String,
    }
}, {
    timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
});

const MovieMatch = mongoose.model('MovieMatch', movieMatchSchema);

module.exports = MovieMatch;