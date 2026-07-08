const { GoogleGenerativeAI } = require("@google/generative-ai");
const buildPrompt = require("./promptBuilder");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
});

const extractCRMData = async (records) => {
  try {
    const prompt = buildPrompt(records);

    const result = await model.generateContent(prompt);

    const response = await result.response;

    let text = response.text();

    // Remove markdown code fences if Gemini returns them
    text = text.replace(/```json/g, "").replace(/```/g, "").trim();

    const crmRecords = JSON.parse(text);

    return crmRecords;
  } catch (error) {
    console.error("AI Service Error:", error);

    throw new Error("Failed to extract CRM data using AI.");
  }
};

module.exports = extractCRMData;