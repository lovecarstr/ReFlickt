const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    // Input validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password entered" });
    }

    // Generate a JWT (JSON Web Token) for session management
    let token;
    try {
      token = jwt.sign(
        { userId: user._id, username: user.username }, // Payload
        process.env.JWT_SECRET, // Secret key
        { expiresIn: "1h" } // Expiration time
      );
    } catch (error) {
      console.error("Unexpected error occured while signing token", error);
      return res.status(403).json({ message: "Failed to make webtoken." });
    }

    // Send the token in response
    res.status(200).json({ message: "Login successful.", token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { logInUser };
