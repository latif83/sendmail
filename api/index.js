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
    from: `"Greenland Online Cleaning Service" <${user}>`,
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

app.post("/send-client-email", async (req, res) => {
  try {
    const { to, toName, subject, status, user, pass, employeeName, position } =
      req.body;

    // console.log({to, toName, subject, status, user, pass, employeeName, position})

    // Validate required fields
    if (
      !to ||
      !toName ||
      !subject ||
      !status ||
      !user ||
      !pass ||
      !employeeName ||
      !position
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Define email content
    const mailOptions = {
      from: `"Schedule Sync" <${user}>`,
      to: to,
      subject: subject,
      html: `
        <p style="text-align:center"><img src="https://towdahexperience.000webhostapp.com/work/logo.png" alt="Company Logo" style="max-width: 200px;"></p>
        <p>Dear ${toName},</p>
        <p>Your appointment with ${employeeName}, ${position} has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
        <p>The employee has been notified and will act accordingly.</p>
        <p>Thank you for choosing us and taking the time to book an appointment with our employees.</p>
        <p>Best Regards,<br/>Schedule Sync</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.post("/send-employee-email", async (req, res) => {
  try {
    const { to, toName, subject, status, user, pass, appointmentData } =
      req.body;

    console.log({ to, toName, subject, status, user, pass, appointmentData });

    // Validate required fields
    if (
      !to ||
      !toName ||
      !subject ||
      !status ||
      !user ||
      !pass ||
      !appointmentData
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Configure Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: user,
        pass: pass,
      },
    });

    // Define email content
    const mailOptions = {
      from: `"Schedule Sync" <${user}>`,
      to: to,
      subject: subject,
      html: `
        <p style="text-align:center"><img src="https://towdahexperience.000webhostapp.com/work/logo.png" alt="Company Logo" style="max-width: 200px;"></p>
        <p>Dear ${toName},</p>
        <p>Your appointment with ${appointmentData.visitorName}, ${
        appointmentData.visitorFrom
      } has been updated to: <strong>${status.toUpperCase()}</strong>.</p>
        <p>The client has been notified.</p>
        <h1> Appointment Details </h1>
        <ul>
        <li>
<h3 style="margin:0;padding:0;"> Name : </h3>
<p style="margin:0;padding:0;"> ${appointmentData.visitorName} </p>
        </li>
        <li>
<h3 style="margin:0;padding:0;"> From : </h3>
<p style="margin:0;padding:0;"> ${appointmentData.visitorFrom} </p>
        </li>
        <li>
<h3 style="margin:0;padding:0;"> Contact : </h3>
<p style="margin:0;padding:0;"> ${appointmentData.visitorPhone} </p>
        </li>
        <li>
<h3 style="margin:0;padding:0;"> Email : </h3>
<p style="margin:0;padding:0;"> ${appointmentData.visitorEmail} </p>
        </li>
        <li>
<h3 style="margin:0;padding:0;"> Date / Time : </h3>
<p style="margin:0;padding:0;"> ${new Date(appointmentData.appointmentDate).toDateString()} @ ${new Date(
        appointmentData.appointmentDate
      ).toLocaleTimeString()} </p>
        </li>
        <li>
        <h3 style="margin:0;padding:0;"> Purpose : </h3>
        <p style="margin:0;padding:0;"> ${appointmentData.purpose} </p>
                </li>
        </ul>
        <p>Thank you for your attention to this matter.</p>
        <p>Best Regards,<br/>Schedule Sync</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent:", info.response);
    res.json({ success: true, message: "Email sent successfully" });
  } catch (error) {
    console.error("Error occurred while sending email:", error);
    res.status(500).json({ success: false, message: "Failed to send email" });
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
