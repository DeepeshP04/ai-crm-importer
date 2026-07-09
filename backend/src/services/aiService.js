const { GoogleGenerativeAI } = require("@google/generative-ai");
const buildPrompt = require("./promptBuilder");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const extractCRMData = async (records) => {
  const prompt = buildPrompt(records);

  const maxRetries = 3;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await model.generateContent(prompt);

      const response = await result.response;

      let text = response.text();

      text = text.replace(/```json/g, "").replace(/```/g, "").trim();

      return JSON.parse(text);

    } catch (error) {

      console.error(`Attempt ${attempt} failed:`, error.message);

      if (attempt === maxRetries) {
        throw new Error("Failed to extract CRM data after multiple attempts.");
      }

      await sleep(2000 * attempt);
    }
  }
};

module.exports = extractCRMData;