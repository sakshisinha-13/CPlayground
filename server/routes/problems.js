const express = require("express");
const router = express.Router();
const Problem = require("../models/Problem");

// GET /api/questions?company=&type=&topic=&difficulty=&role=&yoe=&year=
router.get("/", async (req, res) => {
  try {
    const filter = {};
    const { company, type, topic, difficulty, role, yoe, year } = req.query;

    // Case-insensitive filtering for string fields
    if (company) filter.company = new RegExp(`^${company}$`, 'i');
    if (type) filter.type = new RegExp(`^${type}$`, 'i');
    if (topic) filter.topic = new RegExp(`^${topic}$`, 'i');
    if (difficulty) filter.difficulty = new RegExp(`^${difficulty}$`, 'i');
    if (role) filter.role = new RegExp(`^${role}$`, 'i');
    if (yoe) filter.yoe = new RegExp(`^${yoe}$`, 'i');
    if (year) filter.year = year;

    const problems = await Problem.find(filter);
    res.json(problems);
  } catch (err) {
    console.error("Error fetching problems:", err);
    res.status(500).json({ error: "Failed to fetch problems" });
  }
});

module.exports = router;
