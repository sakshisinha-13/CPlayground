const axios = require("axios");

exports.executeCode = async (req, res) => {
  const { code, language, testCases } = req.body;

  try {
    const response = await axios.post(process.env.COMPILER_API, {
      code,
      language,
      testCases,
    });

    res.status(200).json(response.data);
  } catch (err) {
    console.error("❌ Compiler API error:", err.message);
    res.status(500).json({ error: "Compiler service failed" });
  }
};
