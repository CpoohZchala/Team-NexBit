// FILE: controllers/chatbotController.js
const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI("AIzaSyDgpLs7-h1afwL2MGc8wqbjrEMlCjP1Btc");
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

exports.getAIResponse = async (req, res) => {
  const { prompt } = req.body;

  try {
    const result = await model.generateContent(prompt);
    if (result && result.response && result.response.text) {
      res.json({ response: result.response.text() });
    } else {
      res.status(500).json({ error: "Invalid response structure" });
    }
  } catch (error) {
    console.error("Error generating content:", error);
    res.status(500).json({ error: "Error generating content" });
  }
};