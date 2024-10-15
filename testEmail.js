const sendEmail = require("./server/utils/sendEmail");

sendEmail({
  to: "recipient@example.com",
  subject: "Test Email",
  text: "This is a test email.",
})
  .then((result) => {
    console.log("Test email sent successfully:", result);
  })
  .catch((error) => {
    console.error("Error sending test email:", error);
  });
