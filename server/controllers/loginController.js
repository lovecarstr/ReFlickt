const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");

const logInUser = async (req, res) => {
  try {
    const { email, password } = req.body;

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
    const token = jwt.sign(
      { userId: user._id, username: user.username }, // Payload
      process.env.JWT_SECRET, // Secret key
      { expiresIn: "1h" } // Expiration time
    );

    // Send the token in response
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = { logInUser };
