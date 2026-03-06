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
exports.sendOtp = async (req, res) => {
  const { phone } = req.body;
  if (!phone) return res.status(400).json({ message: "Phone required" });
  const otp = Math.floor(100000 + Math.random() * 900000);
  try {
    // Save to DB
    await new Promise((resolve, reject) => {
      db.query(
        "INSERT INTO otp_users (phone, otp) VALUES (?, ?)",
        [phone, otp],
        (err) => err ? reject(err) : resolve()
      );
    });

    console.log(`\n--- DEVELOPMENT OTP ---`);
    console.log(`Phone: ${phone}`);
    console.log(`OTP: ${otp}`);
    console.log(`-----------------------\n`);

    try {
      await client.messages.create({
        body: `Your OTP is ${otp}`,
        from: process.env.TWILIO_PHONE_NUMBER,
        to: phone,
      });
      res.json({ message: "OTP sent ✅" });
    } catch (twilioErr) {
      console.error("Twilio SMS Error (Likely Trial Restriction):", twilioErr.message || twilioErr);
      // Return 200 because we generated the OTP and logged it to the console
      res.status(200).json({
        message: "OTP generated! (Twilio SMS failed, check terminal for code) ✅",
        devMode: true
      });
    }
  } catch (err) {
    console.error("Database Error in sendOtp:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
};

// Verify OTP & JWT

exports.verifyOtp = (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ message: "Phone & OTP required" });
  }

  // Normalizing phone and otp for comparison
  const normalizedPhone = String(phone).replace(/\D/g, "");
  const inputOtp = String(otp).trim();

  console.log(`[DEBUG] Verifying OTP for normalized phone: ${normalizedPhone}, Input: ${inputOtp}`);

  // Fetch latest OTP from DB for this phone (using LIKE to handle partial matches or different formats)
  db.query(
    "SELECT * FROM otp_users WHERE phone LIKE ? ORDER BY id DESC LIMIT 1",
    [`%${normalizedPhone}`],
    (err, result) => {
      if (err) {
        console.error("[ERROR] DB error retrieving OTP:", err);
        return res.status(500).json({ message: "DB error", error: err });
      }

      if (!result.length) {
        console.warn(`[WARN] No OTP found for phone starting with ${normalizedPhone}`);
        return res.status(400).json({ message: "No OTP found" });
      }

      const savedOtp = String(result[0].otp).trim();
      const otpCreated = new Date(result[0].created_at);
      const now = new Date();
      const diffMinutes = (now - otpCreated) / 1000 / 60;

      console.log(`[DEBUG] Saved OTP: ${savedOtp}, Created At: ${otpCreated}, Diff: ${diffMinutes.toFixed(2)} min`);

      // Dev Mode Bypass: allow 123456 as a universal code if needed, or if it matches
      if (inputOtp === "123456" || inputOtp === savedOtp) {
        if (diffMinutes > 15) { // Increased to 15 min for dev flexibility
          console.warn(`[WARN] OTP expired for ${phone}`);
          return res.status(400).json({ message: "OTP expired. Request a new one." });
        }
        // Success Path...
      } else {
        console.warn(`[WARN] OTP mismatch for ${phone}. Input: ${inputOtp}, Saved: ${savedOtp}`);
        return res.status(400).json({ message: "Invalid OTP" });
      }

      // OTP valid → check if user exists
      User.findByPhone(phone, (err, users) => {
        if (err)
          return res.status(500).json({ message: "DB error", error: err });

        let user = users[0];

        if (!user) {
          // Check if this is the first user EVER
          db.query("SELECT COUNT(*) as count FROM users", (err, countRes) => {
            const isFirstUser = countRes && countRes[0].count === 0;
            const role = isFirstUser ? "admin" : "customer";

            User.create({ phone, name: "New User", role }, (err, result) => {
              if (err)
                return res.status(500).json({ message: "DB error", error: err });

              const newUser = { id: result.insertId, phone, name: "New User", role };
              const token = jwt.sign(
                { id: newUser.id, role: newUser.role },
                process.env.JWT_SECRET,
                { expiresIn: "7d" }
              );
              console.log(`[INFO] New user created: ${phone} as ${role}`);
              return res.json({ message: "OTP verified ✅", user: newUser, token });
            });
          });
        } else {
          // Existing user
          const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
          );
          console.log(`[INFO] User logged in: ${phone}`);
          return res.json({ message: "OTP verified ✅", user, token });
        }
      });
    },
  );
};
