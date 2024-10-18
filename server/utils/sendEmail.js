require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");
const path = require("path");

// Load client credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const USER_EMAIL = process.env.USER_EMAIL;

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Load tokens from tokens.json
const tokensPath = path.resolve(__dirname, "tokens.json");

let tokens;
try {
  const tokensData = fs.readFileSync(tokensPath, "utf8");
  tokens = JSON.parse(tokensData);
  oAuth2Client.setCredentials(tokens);
} catch (error) {
  console.error("Error reading or parsing tokens.json:", error.message);
  console.error("Please re-run generateToken.js to obtain new tokens.");
  process.exit(1);
}

async function sendEmail({ to, subject, text }) {
  try {
    const gmail = google.gmail({ version: "v1", auth: oAuth2Client });

    // Create the email content
    const messageParts = [
      `From: "ReFlickt" <${USER_EMAIL}>`,
      `To: ${to}`,
      `Subject: ${subject}`,
      "",
      `${text}`,
    ];
    const message = messageParts.join("\n");

    // Encode the message to base64
    const encodedMessage = Buffer.from(message)
      .toString("base64")
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");

    // Send the email
    const res = await gmail.users.messages.send({
      userId: "me",
      requestBody: {
        raw: encodedMessage,
      },
    });

    console.log("Email sent:", res.data);
    return res.data;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;
