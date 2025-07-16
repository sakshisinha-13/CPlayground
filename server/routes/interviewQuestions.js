const express = require('express');
const router = express.Router();
const InterviewQuestion = require('../models/InterviewQuestion');

// GET /api/mock-questions
router.get('/', async (req, res) => {
  try {
    const all = await InterviewQuestion.aggregate([{ $sample: { size: 9 } }]); // 3 per category approx
    const grouped = all.reduce((acc, q) => {
      acc[q.category] = acc[q.category] || [];
      acc[q.category].push(q.question);
      return acc;
    }, {});
    res.json(grouped);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch interview questions' });
  }
});

module.exports = router;
