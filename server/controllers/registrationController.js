const bcrypt = require("bcrypt");
const User = require("../models/user");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // Defines the strength of the hashing
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create a new user object
    const newUser = new User({
      username,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the user to database
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { registerUser };
