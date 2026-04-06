require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

app.use(cors());
app.use(express.json());

// Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Test route
app.get("/", (req, res) => {
  res.send("SMTP Server Running 🚀");
});

// Send Email Route
app.post("/send-email", async (req, res) => {
  const { name, email } = req.body || {};

  if (!name || !email) {
    return res.status(400).json({ error: "Missing name or email" });
  }

  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Registration Confirmed | ComicPreneur 2026",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name} 👋</h2>
          <p>Dear Participant,

Greetings from the Entrepreneurship Cell, JNCT & LNCTS ! 

Thank you for registering for *ComicPreneur 2026 – “AI Tools × Human Creativity: Building Startups of the Future.”* 

We are excited to inform you that *your registration has been successfully confirmed* and your spot for this exclusive workshop is now secured. 

• *Date:* 16th April, 2026 (Thursday)
• *Time:* 9:00 AM – 3:30 PM
• *Venue:* Auditorium, Jai Narain College of Technology (JNCT), Bhopal

Get ready to explore AI, creativity and startup innovation in an exciting and interactive workshop.

We look forward to your active participation in making this event a grand success.</p>
          
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    console.log("✅ Email sent to:", email);

    res.json({ success: true });
  } catch (err) {
    console.error("❌ Email error:", err);
    res.status(500).json({ error: "Failed to send email" });
  }
});

// Start server
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} 🚀`);
});require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Create transporter (Gmail SMTP)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true, // true for 465
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password (NOT normal password)
  },
});

// ✅ Verify transporter (VERY IMPORTANT)
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP connection error:", error);
  } else {
    console.log("✅ SMTP server ready");
  }
});

// Test route
app.get("/", (req, res) => {
  res.send("SMTP Server Running 🚀");
});

// Send Email Route
app.post("/send-email", async (req, res) => {
  try {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({ error: "Missing name or email" });
    }

    const mailOptions = {
      from: `"ComicPreneur Team" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Registration Confirmed | ComicPreneur 2026",
      html: `
        <div style="font-family: Arial; padding: 20px;">
          <h2>Hello ${name} 👋</h2>
          <p>
          Dear Participant,<br><br>

          Greetings from the Entrepreneurship Cell, JNCT & LNCTS!<br><br>

          Thank you for registering for <b>ComicPreneur 2026 – “AI Tools × Human Creativity: Building Startups of the Future.”</b><br><br>

          We are excited to inform you that <b>your registration has been successfully confirmed</b> 🎉<br><br>

          <b>Date:</b> 16th April, 2026 (Thursday)<br>
          <b>Time:</b> 9:00 AM – 3:30 PM<br>
          <b>Venue:</b> Auditorium, JNCT, Bhopal<br><br>

          Get ready to explore AI, creativity and startup innovation 🚀<br><br>

          We look forward to your participation!
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return res.json({ success: true });

  } catch (err) {
    console.error("❌ Email error:", err.message || err);
    return res.status(500).json({
      error: "Failed to send email",
      details: err.message,
    });
  }
});

// ❌ REMOVE app.listen() for Vercel
// app.listen(PORT, () => console.log("Server running"));

// ✅ REQUIRED for Vercel
module.exports = app;