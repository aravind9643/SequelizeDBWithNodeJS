const dotenv = require("dotenv");
const sgMail = require("@sendgrid/mail");
dotenv.config();

function sendVerificationEmail(email, token) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
  let hostUrl = process.env.hostUrl;
  const msg = {
    to: email,
    from: "test@example.com",
    subject: "Sending with Twilio SendGrid is Fun",
    text: "and easy to do anywhere, even with Node.js",
    html: `Click on this link to verify your email ${hostUrl}/verification?token=${token}&email=${email}`
  };
  sgMail.send(msg);
}

module.exports = { sendVerificationEmail };
