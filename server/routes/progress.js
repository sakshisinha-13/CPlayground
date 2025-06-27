const express = require("express");
const router = express.Router();
const UserProgress = require("../models/UserProgress");

// Get all solved questions for a user
router.get("/:userId", async (req, res) => {
  try {
    const progress = await UserProgress.find({ userId: req.params.userId, isSolved: true });
    res.json(progress.map(p => p.questionId));
  } catch (err) {
    console.error("Error fetching progress:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Update solved status
router.post("/", async (req, res) => {
  const { userId, questionId, isSolved } = req.body;

  try {
    const existing = await UserProgress.findOne({ userId, questionId });

    if (existing) {
      existing.isSolved = isSolved;
      await existing.save();
    } else {
      await UserProgress.create({ userId, questionId, isSolved });
    }

    res.json({ message: "Progress saved" });
  } catch (err) {
    console.error("Error updating progress:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
