const mongoose = require('mongoose');
const Schema = mongoose.Schema;


// We need to keep track of how many times a movie has been popped from the entries, so that we can reset its votes
const movieEntrySchema = new Schema({
    id: {
        type: int,
        unique: true,
        required: true
    }
});

const MovieEntry = mongoose.model('MovieEntry', movieEntrySchema);

module.exports = MovieEntry;