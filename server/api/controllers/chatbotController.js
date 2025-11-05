// controllers/chatbotController.js
require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

exports.getAIResponse = async (req, res) => {
  const { prompt } = req.body;

  // helper for retry
  async function safeGenerate(prompt, retries = 3) {
    for (let i = 0; i < retries; i++) {
      try {
        const result = await model.generateContent(prompt);
        return result.response.text();
      } catch (err) {
        if (err.message.includes("503") && i < retries - 1) {
          console.warn(`Gemini overloaded, retrying... (${i + 1})`);
          await new Promise(r => setTimeout(r, 1500 * (i + 1))); // backoff
          continue;
        }
        throw err;
      }
    }
  }

  try {
    const reply = await safeGenerate(prompt);
    res.json({ response: reply });
  } catch (error) {
    console.error("Gemini error details:", error.message);

    if (error.message.includes("503")) {
      return res.status(503).json({
        error: "Gemini servers are busy. Please try again in a few seconds.",
      });
    }

    res.status(500).json({ error: "Error generating content" });
  }
};
