// server/index.js
// -----------------------------------------------------------------------------
// Main Express server entry point
// - Connects to MongoDB
// - Loads environment variables
// - Mounts auth and code execution routes
// -----------------------------------------------------------------------------

const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();
app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://frontend:3000",
      "https://c-playground.vercel.app",
      "http://localhost:3000",
      "http://cplayground.me:3000",
      "http://cplayground.me",
     "http://34.93.148.23:3000"
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected"))
  .catch((err) => console.error("❌ MongoDB error:", err));

// --- Ensure User Indexes for Uniqueness ---
const User = require("./models/User");
mongoose.connection.once("open", async () => {
  try {
    await User.init();
    console.log("✅ User indexes ensured");
  } catch (err) {
    console.error("❌ Index setup error:", err.message);
  }
});

// --- Auth Routes ---
const authRoutes = require("./routes/authRoutes");
app.use("/api/auth", authRoutes);
// --- Progress Routes ---
const progressRoutes = require("./routes/progress");
app.use("/api/progress", progressRoutes);

const codeRoutes = require("./routes/codeRoutes");
app.use("/api/code/execute", codeRoutes);


// --- Routes ---
const problemRoutes = require("./routes/problems");
app.use("/api/problems", problemRoutes); // Mounts GET /api/problems

// --- AI ---
const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);

const evaluateRoute = require("./routes/evaluate");
app.use("/api/evaluate", evaluateRoute);

const spinnerEvalRoute = require('./routes/evaluateSpinner');
app.use('/api/evaluate/spinner', spinnerEvalRoute);

const interviewRoutes = require('./routes/interviewQuestions');
app.use('/api/mock-questions', interviewRoutes);

const path = require("path");

// Serve static files from React
// app.use(express.static(path.join(__dirname, "../client/build")));

// // Fallback for React Router routes
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build/index.html"));
// });


// --- Start Server ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
