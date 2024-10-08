const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/user');

const movieMatchSchema = new Schema(
  {
    movieId: {
      type: Number,
      required: true,
    },
    firstUserId: {
      type: Schema.Types.ObjectId, // Use ObjectId to reference User
      ref: "User",
      required: true,
    },
    secondUserId: {
      type: Schema.Types.ObjectId, // Use ObjectId to reference User
      ref: "User",
      default: null,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'], // State of match
      required: true 
    },
    watchWindowExpiresAt: { // Tracks when second user joins, which is the start of the watch window
      type: Date,
      default: null, 
    },
    reservedBy: { 
      type: mongoose.Schema.Types.ObjectId, ref: 'User', 
      default: null 
    },
    reservationExpiresAt: {
      type: Date, 
      default: null 
    },
  }
);

const MovieMatch = mongoose.model("MovieMatch", movieMatchSchema);

module.exports = MovieMatch;
