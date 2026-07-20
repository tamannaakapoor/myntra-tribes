const { GoogleGenAI } = require("@google/genai");
require("dotenv").config();

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function main() {
  try {
    const pager = await ai.models.list();

    console.log("Available Models:\n");

    for await (const model of pager) {
      console.log("--------------------------------");
      console.log("Name:", model.name);
      console.log("Display Name:", model.displayName);
      console.log("Description:", model.description);
      console.log("Supported Actions:", model.supportedActions);
      console.log();
    }
  } catch (err) {
    console.error(err);
  }
}

main();