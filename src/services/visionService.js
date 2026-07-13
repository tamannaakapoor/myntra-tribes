const { getActiveConfig, config: aiConfig } = require("../config/ai");
const {
  buildVisionAnalysisPrompt,
  TRIBE_DEFINITIONS,
} = require("../prompts/visionAnalysisPrompt");
const supabase = require("../config/supabase");

const VALID_TRIBE_SLUGS = ["neon-static", "golden-hour", "vault-heir"];

async function fetchWithTimeout(url, options, timeoutMs) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (err) {
    if (err.name === "AbortError") {
      throw new Error(`Vision API timed out after ${timeoutMs}ms`);
    }
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

function parseJsonResponse(raw) {
  const trimmed = raw.trim();
  const jsonMatch = trimmed.match(/\{[\s\S]*\}/);

  if (!jsonMatch) {
    throw new Error("Vision model did not return valid JSON");
  }

  return JSON.parse(jsonMatch[0]);
}

function validateAnalysis(analysis) {
  if (!Array.isArray(analysis.moodKeywords) || analysis.moodKeywords.length === 0) {
    throw new Error("Invalid analysis: moodKeywords must be a non-empty array");
  }

  if (!Array.isArray(analysis.dominantColors) || analysis.dominantColors.length === 0) {
    throw new Error("Invalid analysis: dominantColors must be a non-empty array");
  }

  const match = analysis.closestTribeMatch;
  if (!match?.slug || !VALID_TRIBE_SLUGS.includes(match.slug)) {
    throw new Error("Invalid analysis: closestTribeMatch.slug must be a valid tribe slug");
  }

  if (!analysis.tribeScores) {
    throw new Error("Invalid analysis: tribeScores is required");
  }

  for (const slug of VALID_TRIBE_SLUGS) {
    if (typeof analysis.tribeScores[slug] !== "number") {
      throw new Error(`Invalid analysis: tribeScores.${slug} must be a number`);
    }
  }

  return analysis;
}

function buildImageContent(imageUrl, imageBase64, mimeType) {
  if (imageUrl) {
    return { type: "url", value: imageUrl };
  }

  if (imageBase64) {
    return {
      type: "base64",
      value: imageBase64.replace(/^data:image\/\w+;base64,/, ""),
      mimeType: mimeType || "image/jpeg",
    };
  }

  throw new Error("Either imageUrl or imageBase64 is required");
}

async function callOpenAI({ model, apiKey, prompt, image, timeoutMs }) {
  const imageBlock =
    image.type === "url"
      ? { type: "image_url", image_url: { url: image.value, detail: "high" } }
      : {
          type: "image_url",
          image_url: {
            url: `data:${image.mimeType};base64,${image.value}`,
            detail: "high",
          },
        };

  const response = await fetchWithTimeout(
    "https://api.openai.com/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        response_format: { type: "json_object" },
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [{ type: "text", text: prompt }, imageBlock],
          },
        ],
      }),
    },
    timeoutMs
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`OpenAI API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.choices?.[0]?.message?.content;

  if (!content) {
    throw new Error("OpenAI returned an empty response");
  }

  return parseJsonResponse(content);
}

async function callAnthropic({ model, apiKey, prompt, image, timeoutMs }) {
  const imageBlock =
    image.type === "url"
      ? { type: "url", url: image.value }
      : {
          type: "base64",
          media_type: image.mimeType,
          data: image.value,
        };

  const response = await fetchWithTimeout(
    "https://api.anthropic.com/v1/messages",
    {
      method: "POST",
      headers: {
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        max_tokens: 1024,
        messages: [
          {
            role: "user",
            content: [
              { type: "image", source: imageBlock },
              { type: "text", text: prompt },
            ],
          },
        ],
      }),
    },
    timeoutMs
  );

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Anthropic API error (${response.status}): ${errorBody}`);
  }

  const data = await response.json();
  const content = data.content?.find((block) => block.type === "text")?.text;

  if (!content) {
    throw new Error("Anthropic returned an empty response");
  }

  return parseJsonResponse(content);
}

async function enrichWithTribeRecord(analysis) {
  const { data: tribe, error } = await supabase
    .from("tribes")
    .select("id, name, slug, description, primary_color, secondary_color, theme_config")
    .eq("slug", analysis.closestTribeMatch.slug)
    .single();

  if (error || !tribe) {
    return analysis;
  }

  return {
    ...analysis,
    closestTribeMatch: {
      ...analysis.closestTribeMatch,
      id: tribe.id,
      description: tribe.description,
      primary_color: tribe.primary_color,
      secondary_color: tribe.secondary_color,
      theme_config: tribe.theme_config,
    },
  };
}

async function buildFallbackAnalysis(reason) {
  const fallbackSlug = aiConfig.fallbackTribeSlug;
  const tribeDef =
    TRIBE_DEFINITIONS.find((tribe) => tribe.slug === fallbackSlug) ||
    TRIBE_DEFINITIONS[0];

  const tribeScores = {
    "neon-static": 0.15,
    "golden-hour": 0.15,
    "vault-heir": 0.15,
  };
  tribeScores[tribeDef.slug] = 0.7;

  const analysis = {
    moodKeywords: tribeDef.mood.slice(0, 6),
    dominantColors: tribeDef.palette.slice(0, 3).map((name, index) => ({
      name: name.replace(/\b\w/g, (char) => char.toUpperCase()),
      hex: "#808080",
      percentage: Math.max(15, 40 - index * 10),
    })),
    closestTribeMatch: {
      name: tribeDef.name,
      slug: tribeDef.slug,
      confidence: 0.5,
      reasoning:
        "Default tribe match applied because vision analysis was unavailable.",
    },
    tribeScores,
  };

  const enriched = await enrichWithTribeRecord(analysis);

  if (enriched.closestTribeMatch.primary_color) {
    enriched.dominantColors[0].hex = enriched.closestTribeMatch.primary_color;
  }
  if (enriched.closestTribeMatch.secondary_color && enriched.dominantColors[1]) {
    enriched.dominantColors[1].hex = enriched.closestTribeMatch.secondary_color;
  }

  enriched.fallbackReason = reason;

  return enriched;
}

async function analyzeImage({ imageUrl, imageBase64, mimeType }) {
  try {
    const { provider, model, apiKey, timeoutMs } = getActiveConfig();
    const prompt = buildVisionAnalysisPrompt();
    const image = buildImageContent(imageUrl, imageBase64, mimeType);

    const rawAnalysis =
      provider === "anthropic"
        ? await callAnthropic({ model, apiKey, prompt, image, timeoutMs })
        : await callOpenAI({ model, apiKey, prompt, image, timeoutMs });

    const analysis = validateAnalysis(rawAnalysis);
    const enriched = await enrichWithTribeRecord(analysis);

    return {
      provider,
      model,
      analysis: enriched,
      fallback: false,
    };
  } catch (err) {
    console.error("Vision analysis failed, using fallback:", err.message);

    const analysis = await buildFallbackAnalysis(err.message);

    return {
      provider: "fallback",
      model: null,
      analysis,
      fallback: true,
      fallbackReason: err.message,
    };
  }
}

module.exports = {
  analyzeImage,
  buildVisionAnalysisPrompt,
  buildFallbackAnalysis,
};
