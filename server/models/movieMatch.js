const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieMatchSchema = new Schema(
  {
    movieId: {
      type: Number,
      required: true,
    },
    firstUserId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference User
      ref: "User",
      required: true,
    },
    secondUserId: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference User
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ['Open', 'Closed'], // Only allows 'Open' or 'Closed'
      required: true 
  }
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const MovieMatch = mongoose.model("MovieMatch", movieMatchSchema);

module.exports = MovieMatch;
