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
    origin: ["http://localhost:3000", "http://frontend:3000"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(bodyParser.json());

// --- MongoDB Connection ---
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
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

// --- Code Execution Route ---
const executeRoute = require("./routes/execute");
app.use("/api/execute", executeRoute);

// --- Routes ---
const problemRoutes = require("./routes/problems");
app.use("/api/problems", problemRoutes); // Mounts GET /api/problems

// --- AI ---
const aiRoutes = require("./routes/ai");
app.use("/api/ai", aiRoutes);


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
