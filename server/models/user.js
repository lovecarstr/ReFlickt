const mongoose = require("mongoose");
const MovieMatch = require("./movieMatch");
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
    tokensRefilled: {
      type: Date,
      default: Date.now(), // Keeps track of when daily tokens for a user is refilled
    },
    watchedMovies: [{
        type: Number
    }],
    currentMatch: { // The current movie a user is matched with.
        type: Schema.Types.ObjectId,
        ref: 'MovieMatch',
        default: null 
    },
    passwordResetToken: {
      type: String,
    },
    passwordResetExpires: {
      type: Date,
    },
}, {
    timestamps: true 
});
 
const User = mongoose.model("User", userSchema);

module.exports = User;
