const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail"); // We'll create this utility function

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    // **Input Validation**
    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    // **Find User by Email**
    const user = await User.findOne({ email });
    if (!user) {
      // **Security Best Practice**
      // Do not reveal whether the email exists to prevent email enumeration
      return res.status(200).json({
        message:
          "If that email address is in our database, we will send you an email to reset your password.",
      });
    }

    // **Generate a Secure Token**
    const resetToken = crypto.randomBytes(32).toString("hex"); // Generates a secure random token that is hashed.
    const tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    // **Hash the Token**
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    // **Save the Hashed Token and Expiration to the User Document**
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = tokenExpiration;
    await user.save();

    // **Create Reset URL**
    const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

    // **Email Message**
    const message = `
      You are receiving this email because you (or someone else) have requested a password reset.
      Please click on the following link to complete the process. This will expire in one hour:

      ${resetUrl}

      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

    // **Send Email**
    // Utility function.
    await sendEmail({
      to: user.email,
      subject: "Password Reset",
      text: message,
    });

    res.status(200).json({ message: "Password reset email sent." });
  } catch (error) {
    console.error("Password Reset Request Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const resetPassword = async (req, res) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      // Validate input
      if (!password) {
        return res.status(400).json({ message: "Password is required." });
      }
  
      // Hash the token from params
      const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  
      // Find user by token and check if token has expired
      const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() },
      });
  
      if (!user) {
        return res.status(400).json({ message: "Invalid or expired token." });
      }
  
      // Update password and clear reset fields
      user.password = await bcrypt.hash(password, 10);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
  
      await user.save();
  
      res.status(200).json({ message: "Password has been reset successfully." });
    } catch (error) {
      console.error("Password Reset Error:", error);
      res.status(500).json({ message: "Server error." });
    }
  };
  
  module.exports = { requestPasswordReset, resetPassword };
  