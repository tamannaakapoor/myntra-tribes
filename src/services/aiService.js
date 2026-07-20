const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

const generateEditorial = async (tribe, items) => {
  const prompt = `
You are a fashion editor.

User's Tribe: ${tribe}

Products:
${items.map((item, i) => `${i + 1}. ${item}`).join("\n")}

Generate ONLY valid JSON:

{
  "title": "...",
  "description": "...",
  "hashtags": ["...", "...", "...", "...", "..."]
}
`;

  const completion = await groq.chat.completions.create({
    model: "llama-3.3-70b-versatile",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.7,
    response_format: {
      type: "json_object",
    },
  });

  return JSON.parse(completion.choices[0].message.content);
};

module.exports = {
  generateEditorial,
};