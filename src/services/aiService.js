const { GoogleGenAI } = require("@google/genai");

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const generateCaption = async ({ items, tribe }) => {
  const prompt = `
You are a fashion influencer.

Generate:

1. Catchy title (maximum 6 words)
2. Instagram caption (2 sentences)
3. Exactly 5 hashtags

Items:
${items.join(", ")}

Tribe:
${tribe}

Return ONLY valid JSON:

{
"title":"",
"caption":"",
"hashtags":["","","","",""]
}
`;

  const response = await ai.models.generateContent({
    model: "gemini-2.0-flash",
    contents: prompt,
  });

  let text = response.text.trim();

  // Remove Markdown code fences if Gemini wraps the JSON
  text = text.replace(/```json/g, "").replace(/```/g, "").trim();

  return JSON.parse(text);
};

module.exports = {
  generateCaption,
};