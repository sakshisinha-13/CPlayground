const express = require("express");
const multer = require("multer");
const { spawn } = require("child_process");
const path = require("path");
const fs = require("fs");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/", upload.single("audio"), async (req, res) => {
  const question = req.body.question;
  const typedAnswer = req.body.answer;

  // 📝 Case: Text-only answer
  if (!req.file && question && typedAnswer) {
    const prompt = `
You are a strict and insightful AI interview coach.

The student was asked the following question:
"${question}"

Here is their written answer:
"${typedAnswer}"

Your task:
1. Determine if their answer is accurate and complete.
2. If anything is missing or unclear, give specific suggestions.
3. Be concise but constructive.

Return one of the following:
- If the answer is correct, return: "✅ Good job!"
- Otherwise, return: "❌ Try improving this..." followed by helpful feedback.
    `.replace(/[^\x00-\x7F]/g, ""); // remove unicode

    const payload = {
      model: "gemma3",
      prompt,
      stream: false,
    };

    const curl = spawn("curl", [
      "-s",
      "http://localhost:11434/api/generate",
      "-H",
      "Content-Type: application/json",
      "-d",
      JSON.stringify(payload),
    ]);

    let output = "";
    curl.stdout.on("data", (data) => {
      output += data.toString();
    });

    curl.stderr.on("data", (data) => {
      console.error("❌ Curl stderr:", data.toString());
    });

    curl.on("close", () => {
      try {
        const parsed = JSON.parse(output);
        const feedback = parsed?.response?.trim();
        if (!feedback) {
          console.error("❌ AI returned empty or malformed feedback:", output);
          return res
            .status(500)
            .json({ feedback: "AI response was empty or invalid." });
        }
        return res.json({ feedback });
      } catch (err) {
        console.error("❌ JSON Parse Error:", err.message);
        console.error("🧾 Raw AI output:", output);
        return res.status(500).json({ feedback: "Invalid AI response." });
      }
    });

    return;
  }

  // 🎙️ Case: Audio upload
  if (!req.file || !question) {
    return res.status(400).json({ feedback: "Missing audio or question." });
  }

  const audioPath = path.join(__dirname, "..", "uploads", req.file.filename);
  const command = `python evaluate_spinner.py "${audioPath}" "${question.replace(
    /"/g,
    "'"
  )}"`;

  const { exec } = require("child_process");
  exec(command, (error, stdout, stderr) => {
    fs.unlink(audioPath, () => {});
    if (error) {
      console.error("❌ Python Error:", stderr);
      return res.status(500).json({ feedback: "Something went wrong!" });
    }
    return res.json({ feedback: stdout.trim() });
  });
});

module.exports = router;
