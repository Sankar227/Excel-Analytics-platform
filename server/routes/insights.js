const express = require("express");
const router = express.Router();
const axios = require("axios");

router.post("/", async (req, res) => {
  const { data, question } = req.body;

  if (!data || !Array.isArray(data) || !question) {
    return res
      .status(400)
      .json({ error: "Both data and question are required" });
  }

  // Convert the file data to a readable format for the AI
  const formattedData = data
    .map(
      (row, index) =>
        `Row ${index + 1}: ` +
        Object.entries(row)
          .map(([k, v]) => `${k}: ${v}`)
          .join(", ")
    )
    .join("\n");

  const prompt = `You are analyzing spreadsheet data.\n\nData:\n${formattedData}\n\nQuestion:\n${question}\n\nAnswer:`;

  try {
    const geminiRes = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }],
      }
    );

    const aiText = geminiRes.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ insight: aiText });
  } catch (err) {
    console.error("Gemini API Error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to generate AI insight" });
  }
});

module.exports = router;
