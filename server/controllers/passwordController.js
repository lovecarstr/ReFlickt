const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

const changePassword = async (req, res) => {
  try {
    // Extract user ID from the authenticated user (set by authMiddleware)
    const userId = req.user.userId;
    const { oldPassword, newPassword } = req.body;

    // **Input Validation**
    if (!oldPassword || !newPassword) {
      return res
        .status(400)
        .json({ message: "Old password and new password are required." });
    }

    // **Find the User in the Database**
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // **Verify Old Password**
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Old password is incorrect." });
    }

    // **Hash the New Password**
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // **Update Password**
    user.password = hashedPassword;
    await user.save();

    res
      .status(200)
      .json({ message: "Password has been changed successfully." });
  } catch (error) {
    console.error("Change Password Error:", error);
    res.status(500).json({ message: "Server error." });
  }
};

const requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(200).json({
        message:
          "If that email address is in our database, we will send you an email to reset your password.",
      });
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const tokenExpiration = Date.now() + 3600000; // Token valid for 1 hour

    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = tokenExpiration;
    await user.save();

    const resetUrl = `http://localhost:3000/auth/reset-password/${resetToken}`;

    const message = `
      You are receiving this email because you (or someone else) have requested a password reset.
      Please click on the following link to complete the process. This will expire in one hour:

      ${resetUrl}

      If you did not request this, please ignore this email and your password will remain unchanged.
    `;

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

    if (!password) {
      return res.status(400).json({ message: "Password is required." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token." });
    }

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

module.exports = { requestPasswordReset, resetPassword, changePassword };
