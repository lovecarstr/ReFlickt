// generateToken.js

require("dotenv").config();
const { google } = require("googleapis");
const http = require("http");
const url = require("url");
const destroyer = require("server-destroy");

// Load client credentials from environment variables
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";

// Initialize OAuth2 client
const oAuth2Client = new google.auth.OAuth2(
  CLIENT_ID,
  CLIENT_SECRET,
  REDIRECT_URI
);

// Define the required scopes
const SCOPES = ["https://www.googleapis.com/auth/gmail.send"];

async function getAccessToken() {
  // Generate the URL for the user to authorize
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: "offline", // 'offline' to get a refresh token
    scope: SCOPES,
    prompt: "consent", // Force consent to get new refresh token
  });

  console.log("Authorize this app by visiting this url:", authUrl);

  // Dynamically import the 'open' module
  const open = (await import("open")).default;

  // Open the URL in the default browser
  await open(authUrl);

  // Start a local server to receive the OAuth2 callback
  const server = http
    .createServer(async (req, res) => {
      if (req.url.indexOf("/oauth2callback") > -1) {
        const qs = new url.URL(req.url, "http://localhost:3000").searchParams;
        const code = qs.get("code");

        console.log(`Code is ${code}`);
        res.end("Authentication successful! Please return to the console.");
        server.destroy();

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Save the tokens to a file
        const fs = require("fs");
        fs.writeFileSync("tokens.json", JSON.stringify(tokens));
        console.log("Tokens saved to tokens.json");
      }
    })
    .listen(3000, () => {
      console.log("Listening on port 3000");
    });
  destroyer(server);
}

getAccessToken().catch(console.error);
