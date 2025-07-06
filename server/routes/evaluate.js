const express = require("express");
const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.post("/evaluate", upload.single("audio"), async (req, res) => {
  const audioPath = path.join(__dirname, "..", "uploads", req.file.filename);
  const code = req.body.code;

  exec(`python evaluate.py "${audioPath}" "${code.replace(/"/g, "'")}"`, (error, stdout, stderr) => {
    if (error) {
      console.error(stderr);
      return res.status(500).json({ feedback: "Something went wrong!" });
    }

    return res.json({ feedback: stdout.trim() });
  });
});

module.exports = router;
