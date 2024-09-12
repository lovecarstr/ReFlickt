const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieRatingSchema = new Schema({
    recommendation: {
        type: Boolean,
        required: true,
    },
    story: {
        type: Number,
        required: true,
    },
    performances: {
        type: Number,
        required: true,
    },
    directing: {
        type: Number,
        required: true,
    },
    visuals: {
        type: Number,
        required: true
    },
    sound: {
        type: Number,
        required: true
    }
}, {
    timestamps: true  // Automatically add `createdAt` and `updatedAt` fields
});

const MovieRating = mongoose.model('MovieRating', movieRatingSchema);

module.exports = MovieRating;