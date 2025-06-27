// controllers/authController.js
// -----------------------------------------------------------------------------
// Handles user authentication logic: signup and login
// - Validates inputs, checks for existing users
// - Hashes passwords using bcrypt
// - Issues JWT tokens on successful login/signup
// -----------------------------------------------------------------------------

const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ========================= SIGNUP CONTROLLER =========================
exports.signup = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    console.log(`📨 Signup attempt → Email: ${email}, Username: ${username}`);

    // 🔍 Check for duplicate email
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email is already registered" });
    }

    // 🔍 Check for duplicate username
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username is already taken" });
    }

    // 🔐 Hash password and create user
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    // 🎟️ Issue JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(201).json({ user, token });

  } catch (err) {
    // ⚠️ Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({ message: "Duplicate field error" });
    }

    console.error("❌ SIGNUP ERROR (FULL):", err);  // ✅ This logs full error object
    res.status(500).json({ message: "Internal Server Error" });
  }
};



// ========================== LOGIN CONTROLLER =========================
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log(`🔐 Login attempt → Email: ${email}`);

    // 🔍 Check if user exists
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    // ✅ Compare hashed passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    // 🎟️ Issue JWT token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "2h",
    });

    res.status(200).json({ user, token });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ message: err.message });
  }
};
