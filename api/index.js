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
  const { to, subject, status, user, pass, company, service } = req.body;

  if (!to || !subject || !status || !user || !pass || !company || !service) {
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
    from: "Greenland Online Cleaning Service",
    to: to,
    subject: subject,
    html: `
    <p style="text-align:center"><img src="https://towdahexperience.000webhostapp.com/work/logo1.png" alt="Company Logo" style="max-width: 200px;"></p>
    <p>Dear ${company},</p>
    <p>Your cleaning service request <strong>${service.toUpperCase()}</strong> status is: <strong>${status.toUpperCase()}</strong>.</p>
    <p>Thank you for choosing Greenland Online Cleaning Service.</p> <br />
    <p>Best Regards,<br/>Greenland Online Cleaning Service</p>
  `, // HTML content for the email body
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
