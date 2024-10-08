const nodemailer = require("nodemailer");
const { google } = require("googleapis");

// OAuth2 setup
const OAuth2 = google.auth.OAuth2;

const sendEmail = async (options) => {
  const oauth2Client = new OAuth2(
    process.env.CLIENT_ID, // Client ID from your .env file
    process.env.CLIENT_SECRET, // Client Secret from your .env file
    "https://developers.google.com/oauthplayground" // Redirect URL
  );

  // Set the refresh token from .env
  oauth2Client.setCredentials({
    refresh_token: process.env.REFRESH_TOKEN, // Long-lived refresh token
  });

  try {
    // Get a new access token using the refresh token
    const accessTokenObject = await oauth2Client.getAccessToken();
    const accessToken =
      accessTokenObject.token || accessTokenObject.access_token;

    // Create Nodemailer transporter using OAuth2
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        type: "OAuth2",
        user: process.env.EMAIL_USER, // Your email address
        clientId: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        refreshToken: process.env.REFRESH_TOKEN,
        accessToken: accessToken, // Use the freshly obtained access token
      },
    });

    // Email options
    const mailOptions = {
      from: `"ReFlick" <${process.env.EMAIL_USER}>`,
      to: options.to, // recipient email
      subject: options.subject, // email subject
      text: options.text, // email body
    };

    // Send the email
    await transporter.sendMail(mailOptions);
    console.log("Email sent successfully!");
  } catch (error) {
    console.error("Error sending email:", error);
    throw error; // Throw error to handle it in the calling function
  }
};

module.exports = sendEmail;
