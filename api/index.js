const express = require("express");
const nodemailer = require("nodemailer");
const bodyParser = require("body-parser");

const app = express();
// Use the provided default production port or fallback to 3000 for local development
const port = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());

app.get("/", (req, res) => res.send("Express on Vercel"));

// Route for sending email
app.post("/send-email", (req, res) => {
  const { to, subject, status, user, pass } = req.body;

  if (!to || !subject || !status || !user || !pass) {
    return res
      .status(400)
      .json({ success: false, message: "Missing required fields" });
  }

  // Configure Nodemailer
  const transporter = nodemailer.createTransport({
    // Configure your email service here
    service: "Gmail",
    auth: {
      user: user,
      pass: pass,
    },
  });

  // Define email content
  const mailOptions = {
    from: "user",
    to: to,
    subject: subject,
    text: `Your cleaning service request status is: ${status}`, // Include status in email text
  };

  // Send email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log("Error occurred while sending email:", error);
      res.status(500).json({ success: false, message: "Failed to send email" });
    } else {
      console.log("Email sent:", info.response);
      res.json({ success: true, message: "Email sent successfully" });
    }
  });
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
