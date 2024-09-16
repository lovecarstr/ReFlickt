const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema ({
    title: {
        type: String,
        required: true,
    },
    director: {
        type: String,
        required: true,
    },
    writers: [{
        type: String,
        required: true
    }],
    year: {
        type: Number,
        required: true,
    },
    runtime: {
        type: Number,
        required: true,
    },
    description: {
        type: String,
        required: false
    },
    imdbRating: {
        type: Number,
        required: false
    }


}, {
    timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
});

const Movie = mongoose.model('Movie', movieSchema);

module.exports = Movie;