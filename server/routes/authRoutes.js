// routes/authRoutes.js
// -----------------------------------------------------------------------------
// Express routes for authentication endpoints
// - POST /signup → Calls signup controller
// - POST /login → Calls login controller
// -----------------------------------------------------------------------------

const express = require("express");
const router = express.Router();

// 🔗 Import controller logic
const { signup, login } = require("../controllers/authController");

// 📝 Routes
router.post("/signup", signup); // User registration
router.post("/login", login);   // User login

module.exports = router;
