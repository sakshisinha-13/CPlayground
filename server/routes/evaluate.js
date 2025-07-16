const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const fs = require("fs");
const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  if (!req.file || !req.body.code) {
    return res.status(400).json({ feedback: "Missing audio or code." });
  }

  const audioPath = path.join(__dirname, "..", "uploads", req.file.filename);
  const code = req.body.code;

  const command = `python evaluate.py "${audioPath}" "${code.replace(/"/g, "'")}"`;
  console.log("🔍 Running command:", command);

  exec(command, (error, stdout, stderr) => {
    if (error) {
      console.error("❌ Python Error:", stderr);
      return res.status(500).json({ feedback: "Something went wrong!" });
    }

    console.log("✅ AI Feedback:", stdout);
    return res.json({ feedback: stdout.trim() });
  });
});


module.exports = router;

