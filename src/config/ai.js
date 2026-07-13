require("dotenv").config();

const provider = (process.env.VISION_PROVIDER || "openai").toLowerCase();

const config = {
  provider,
  timeoutMs: Number(process.env.VISION_TIMEOUT_MS) || 30000,
  fallbackTribeSlug: process.env.VISION_FALLBACK_TRIBE_SLUG || "neon-static",
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.VISION_MODEL || "gpt-4o",
  },
  anthropic: {
    apiKey: process.env.ANTHROPIC_API_KEY,
    model: process.env.VISION_MODEL || "claude-sonnet-4-20250514",
  },
};

function getActiveConfig() {
  if (provider === "anthropic") {
    if (!config.anthropic.apiKey) {
      throw new Error("ANTHROPIC_API_KEY is required when VISION_PROVIDER=anthropic");
    }
    return { provider: "anthropic", ...config.anthropic, timeoutMs: config.timeoutMs };
  }

  if (!config.openai.apiKey) {
    throw new Error("OPENAI_API_KEY is required when VISION_PROVIDER=openai");
  }

  return { provider: "openai", ...config.openai, timeoutMs: config.timeoutMs };
}

module.exports = { config, getActiveConfig };
