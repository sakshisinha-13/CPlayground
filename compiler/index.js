const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { executeCode } = require("./utils/execute");

app.use(cors());
app.use(express.json());

app.post("/", async (req, res) => {
  const { code, language, testCases } = req.body;

  try {
    const results = await executeCode(code, language, testCases);
    res.json(results);
  } catch (err) {
    console.error("❌ Execution failed:", err.message);
    res.status(500).json({ error: "Execution failed", message: err.message });
  }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => console.log(`Compiler service running on port ${PORT}`));
