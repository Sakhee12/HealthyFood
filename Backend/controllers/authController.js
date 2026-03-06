const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");
const db = require("../config/db"); // ⚠ Add this line to use MySQL
require("dotenv").config();

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN,
);

// Send OTP
exports.sendOtp = (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone required" });

  const otp = Math.floor(100000 + Math.random() * 900000);

  db.query(
    "INSERT INTO otp_users (phone, otp) VALUES (?, ?)",
    [phone, otp],
    (err) => {
      if (err) return res.status(500).json(err);

      client.messages
        .create({
          body: `Your OTP is ${otp}`,
          from: process.env.TWILIO_PHONE_NUMBER,
          to: phone,
        })
        .then(() => res.json({ message: "OTP sent ✅" }))
        .catch((err) => res.status(500).json(err));
    },
  );
};

// Verify OTP & JWT

exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone & OTP required" });
  }

  // Fetch latest OTP from DB
  db.query(
    "SELECT * FROM otp_users WHERE phone=? ORDER BY id DESC LIMIT 1",
    [phone],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      if (!result.length)
        return res.status(400).json({ message: "No OTP found" });

      const savedOtp = String(result[0].otp).trim();
      const inputOtp = String(otp).trim();

      // Optional: OTP expiration 5 minutes
      const otpCreated = new Date(result[0].created_at);
      const now = new Date();
      const diffMinutes = (now - otpCreated) / 1000 / 60;
      if (diffMinutes > 5) {
        return res
          .status(400)
          .json({ message: "OTP expired. Request a new one." });
      }

      if (savedOtp !== inputOtp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP valid → check if user exists
      User.findByPhone(phone, (err, users) => {
        if (err)
          return res.status(500).json({ message: "DB error", error: err });

        let user = users[0];

        if (!user) {
          // Create new user
          User.create({ phone, name: "New User" }, (err, result) => {
            if (err)
              return res.status(500).json({ message: "DB error", error: err });

            user = { id: result.insertId, phone, name: "New User" };
            return res.json({ message: "OTP verified ✅", user });
          });
        } else {
          // Existing user
          return res.json({ message: "OTP verified ✅", user });
        }
      });
    },
  );
};
