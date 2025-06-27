// models/User.js
// -----------------------------------------------------------------------------
// Mongoose model for User schema
// - Stores username, email, and hashed password
// - Enforces unique usernames and emails
// -----------------------------------------------------------------------------

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true }, // unique username
  email:    { type: String, required: true, unique: true }, // unique email
  password: { type: String, required: true },               // hashed password
});

module.exports = mongoose.model("User", userSchema);