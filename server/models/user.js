const mongoose = require("mongoose");
const MovieMatch = require("./movieMatch");
const Movie = require("./movie");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [/.+\@.+\..+/, "Please fill a valid email address"], // Simple email validation
    },
    tokens: {
      type: Number,
      default: 5, // Start users off with 5 tokens
    },
    currentMatch: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MovieMatch",
    },
    watchedMovies: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Movie", // Reference to the Movie model
      }],
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
