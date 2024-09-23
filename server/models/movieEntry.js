const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const movieEntrySchema = new Schema({
    movieId: {
        type: String,
        required: true
    },
    count: { // Count needed to track how many times a movie has been matched with users 
        type: Number,
        default: 0
    }
});

const MovieEntry = mongoose.model('MovieEntry', movieEntrySchema);

module.exports = MovieEntry;