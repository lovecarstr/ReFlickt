require("dotenv").config();
const { google } = require("googleapis");
const fs = require("fs");
const readline = require("readline");

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const USER_EMAIL = process.env.USER_EMAIL;

const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Generate the URL for the user to authorize
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

const authUrl = oAuth2Client.generateAuthUrl({
  access_type: "offline", // 'offline' to get a refresh token
  scope: SCOPES,
  prompt: "consent", // Force consent to get new refresh token
});

console.log("Authorize this app by visiting this url:", authUrl);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question("Enter the code from that page here: ", async (code) => {
  rl.close();
  try {
    const { tokens } = await oAuth2Client.getToken(code);
    console.log("Tokens obtained:", tokens);

    // Save the tokens to a file or secure storage
    fs.writeFileSync("tokens.json", JSON.stringify(tokens));
    console.log("Tokens saved to tokens.json");
  } catch (error) {
    console.error("Error retrieving access token", error);
  }
});
