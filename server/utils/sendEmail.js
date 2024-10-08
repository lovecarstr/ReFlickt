require("dotenv").config();
const fs = require("fs");
const path = require("path");
const { google } = require("googleapis");
  
// Construct the absolute path to tokens.json
const tokensPath = path.resolve(__dirname, "tokens.json");

// Read the tokens
const tokens = JSON.parse(fs.readFileSync(tokensPath));

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const USER_EMAIL = process.env.USER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Load the tokens from tokens.json
//const tokens = JSON.parse(fs.readFileSync('tokens.json'));
//oAuth2Client.setCredentials(tokens);

async function sendEmail({ to, subject, text }) {
  try {
    // Get a new access token if needed
    const accessToken = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        type: "OAuth2",
        user: USER_EMAIL,
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: tokens.refresh_token,
        accessToken: accessToken.token, // This will ensure the token is fresh
      },
    });

    const mailOptions = {
      from: "ReFlick <love.strandang@gmail.com>",
      to,
      subject,
      text,
    };

    const result = await transporter.sendMail(mailOptions);
    console.log("Email sent:", result);
    return result;
  } catch (error) {
    console.error("Error sending email:", error);
    throw error;
  }
}

module.exports = sendEmail;
