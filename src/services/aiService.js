const { GoogleGenAI } = require("@google/genai");
console.log("Gemini Key:", process.env.GEMINI_API_KEY);
const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY,
});

const generateEditorial = async (items, tribe) => {

    const prompt = `
You are a fashion editor for Myntra.

Outfit Items:
${items.join(", ")}

User Tribe:
${tribe}

Generate:
1. Catchy title (max 6 words)
2. Exactly 2 sentence caption
3. Exactly 5 hashtags

Return ONLY JSON.

{
"title":"",
"description":"",
"hashtags":[]
}
`;

    const response = await ai.models.generateContent({
        model: "gemini-flash-latest",
        contents: prompt,
        config: {
            responseMimeType: "application/json",
            temperature: 0.9,
        },
    });

    return JSON.parse(response.text);
};

module.exports = {
    generateEditorial
};