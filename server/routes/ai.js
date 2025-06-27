const express = require("express");
const router = express.Router();
const { getCodeFeedback } = require("../controllers/ai");

router.post("/feedback", getCodeFeedback);

module.exports = router;
