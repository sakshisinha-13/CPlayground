require('dotenv').config();
const axios = require("axios");

const getCodeFeedback = async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Code is required." });
  }


  try {
    //     const response = await axios.post(
    //       "https://openrouter.ai/api/v1/chat/completions",
    //       {
    //         model: "mistralai/mixtral-8x7b-instruct", // or try "openai/gpt-3.5-turbo"
    //         messages: [
    //           {
    //             role: "system",
    //             content: "You are a helpful code reviewer. Review the given code.",
    //           },
    //           {
    //             role: "user",
    //             content: `Please review this code:\n\n${code}`,
    //           },
    //         ],
    //       },
    //       {
    //         headers: {
    //   Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
    //   //"HTTP-Referer": "http://localhost:3000", // Optional
    //   "Content-Type": "application/json",
    // },

    //       }
    //     );

    //     const feedback = response.data.choices[0].message.content;
    //     res.json({ feedback });
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    const response = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [
          {
            parts: [
              {
                text: `Please review this code and give concise suggestions:\n\n${code}`,
              },
            ],
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const feedback = response.data.candidates?.[0]?.content?.parts?.[0]?.text;

    res.json({ feedback });

  } catch (err) {
    // console.error("OpenRouter AI error:", err.response?.data || err.message);
    // res.status(500).json({ error: "AI feedback failed", details: err.response?.data || err.message, });
    console.error("Gemini AI error:", err.response?.data || err.message);
    res.status(500).json({
      error: "Gemini AI feedback failed",
      details: err.response?.data || err.message,
    });
  }
};

module.exports = { getCodeFeedback };
