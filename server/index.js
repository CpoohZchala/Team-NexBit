import { GoogleGenerativeAI } from "@google/generative-ai";

async function run() {
  try {
    const genAI = new GoogleGenerativeAI("AIzaSyCw8J_4xxTzsbGAdO4nMGvNaX_y0wsSUJY");
    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    const prompt = "Explain how AI works";
    const result = await model.generateContent(prompt);

    console.log(result.response.text());
  } catch (error) {
    console.error("Error fetching AI response:", error.message);
  }
}

run();
