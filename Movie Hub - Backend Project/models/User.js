const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String },
  email: { type: String, unique: true, sparse: true },
  password: { type: String },
  googleId: { type: String },
  profilePic: { type: String },
  resetToken: String,
  resetTokenExpire: Date
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);
