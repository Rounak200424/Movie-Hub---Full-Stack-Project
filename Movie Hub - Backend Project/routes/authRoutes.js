const express=require('express');
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User=require('../models/User');

const crypto = require("crypto");

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;


const router=express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

// SIGNUP Logic

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username,
      email,
      password: hashedPassword
    });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      username: user.username,
      profilePic: null
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// LOGIN LOGIC

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Incorrect password" });

    const token = jwt.sign(
      { id: user._id, username: user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      success: true,
      token,
      username: user.username,
      profilePic: user.profilePic || null
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// GOOGLE LOGIC

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:3000/auth/google/callback"
  },
  async (accessToken, refreshToken, profile, done) => {
    try {

      let user = await User.findOne({ googleId: profile.id });

      if (!user) {
        user = await User.create({
          username: profile.displayName,
          email: profile.emails[0].value,
          googleId: profile.id,
          profilePic: profile.photos[0].value
        });
      }

      done(null, user);

    } catch (err) {
      done(err, null);
    }
  }
));

// GOOGLE ROUTES
router.get("/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);


router.get("/google/callback",
  passport.authenticate("google", { session: false }),
  (req, res) => {

    const token = jwt.sign(
      { id: req.user._id, username: req.user.username },
      JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.redirect(
      `http://localhost:5500/mainpg.html?token=${token}&username=${req.user.username}&pic=${req.user.profilePic}`
    );
  }
);

//FORGOT PASSWORD

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetToken = resetToken;
    user.resetTokenExpire = Date.now() + 10 * 60 * 1000; // 10 mins
    await user.save();

    res.json({
      success: true,
      message: "Reset token generated",
      resetToken   // Later you will send by email
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

//RESET PASSWORD

router.post("/reset-password/:token", async (req, res) => {
  try {
    const { password } = req.body;
    const { token } = req.params;

    const user = await User.findOne({
      resetToken: token,
      resetTokenExpire: { $gt: Date.now() }
    });

    if (!user)
      return res.status(400).json({ message: "Token expired or invalid" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetToken = undefined;
    user.resetTokenExpire = undefined;

    await user.save();

    res.json({
      success: true,
      message: "Password updated successfully"
    });

  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});











module.exports = router;
