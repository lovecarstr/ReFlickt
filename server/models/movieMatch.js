const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const User = require('../models/user');

const movieMatchSchema = new Schema(
  {
    movieId: {
      type: String,
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
      required: false,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'], // Only allows 'Open' or 'Closed'
      required: true 
    },
    matchClosedAt: { // Tracks when second user joins, which is the start of the watch window
      type: Date,
      default: null, 
  }
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const MovieMatch = mongoose.model("MovieMatch", movieMatchSchema);

module.exports = MovieMatch;
