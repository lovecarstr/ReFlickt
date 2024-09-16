const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const movieMatchSchema = new Schema(
  {
    movieID: {
      type: Number,
      required: true,
    },
    firstUserID: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference User
      ref: "User",
      required: true,
    },
    secondUserID: {
      type: mongoose.Schema.Types.ObjectId, // Use ObjectId to reference User
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add `createdAt` and `updatedAt` fields
  }
);

const MovieMatch = mongoose.model("MovieMatch", movieMatchSchema);

module.exports = MovieMatch;
