require("dotenv").config();

const express = require("express");
const cors = require("cors");
const nodemailer = require("nodemailer");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ Create SMTP transporter (Gmail)
const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

// ✅ Verify SMTP connection
transporter.verify((error, success) => {
  if (error) {
    console.error("❌ SMTP Error:", error);
  } else {
    console.log("✅ SMTP Ready");
  }
});

// ✅ Root route
app.get("/", (req, res) => {
  res.status(200).send("Server Running 🚀");
});

// ✅ Send Email Route
app.post("/send-email", async (req, res) => {
  try {
    const { name, email } = req.body || {};

    if (!name || !email) {
      return res.status(400).json({
        error: "Name and Email are required",
      });
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

          Thank you for registering for 
          <b>ComicPreneur 2026 – AI Tools × Human Creativity</b>.<br><br>

          ✅ Your registration has been successfully confirmed.<br><br>

          <b>Date:</b> 16th April, 2026<br>
          <b>Time:</b> 9:00 AM – 3:30 PM<br>
          <b>Venue:</b> Auditorium, JNCT, Bhopal<br><br>

          Get ready for an amazing experience 🚀
          </p>
        </div>
      `,
    };

    const info = await transporter.sendMail(mailOptions);

    console.log("✅ Email sent:", info.response);

    return res.status(200).json({
      success: true,
      message: "Email sent successfully",
    });

  } catch (err) {
    console.error("❌ Email Error:", err);

    return res.status(500).json({
      error: "Failed to send email",
      details: err.message,
    });
  }
});

// ✅ IMPORTANT: Use dynamic PORT for Render
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});