const TRIBE_DEFINITIONS = [
  {
    name: "Neon Static",
    slug: "neon-static",
    description: "Cyberpunk × Y2K fusion",
    palette: ["electric purple", "chrome", "neon green", "black"],
    signals: [
      "chunky sneakers",
      "oversized streetwear",
      "layered chains",
      "RGB / neon lighting",
      "bold graphics and techwear",
      "Seoul nightlife energy",
    ],
    mood: ["edgy", "futuristic", "bold", "rebellious", "urban", "cyberpunk"],
  },
  {
    name: "Golden Hour",
    slug: "golden-hour",
    description: "Warm, romantic, natural ease",
    palette: ["cream", "sage green", "terracotta", "soft gold"],
    signals: [
      "flowy dresses and soft fabrics",
      "canvas sandals",
      "floral or delicate jewelry",
      "vintage / cottagecore touches",
      "earthy neutrals and pastels",
      "cozy café aesthetic",
    ],
    mood: ["warm", "romantic", "soft", "natural", "dreamy", "bohemian"],
  },
  {
    name: "Vault Heir",
    slug: "vault-heir",
    description: "Old-money elegance and timeless polish",
    palette: ["navy", "camel", "ivory", "burgundy"],
    signals: [
      "tailored shirts and trousers",
      "leather loafers or dress shoes",
      "classic watches",
      "structured bags",
      "minimal luxury interiors",
      "country club / resort polish",
    ],
    mood: ["refined", "elegant", "preppy", "luxurious", "timeless", "polished"],
  },
];

const RESPONSE_SCHEMA = {
  moodKeywords: ["string — 5 to 8 lowercase aesthetic/mood descriptors"],
  dominantColors: [
    {
      name: "human-readable color name",
      hex: "#RRGGBB",
      percentage: "approximate visual weight 0-100",
    },
  ],
  closestTribeMatch: {
    name: "Neon Static | Golden Hour | Vault Heir",
    slug: "neon-static | golden-hour | vault-heir",
    confidence: "0.0 to 1.0",
    reasoning: "one sentence explaining the match",
  },
  tribeScores: {
    "neon-static": "0.0 to 1.0",
    "golden-hour": "0.0 to 1.0",
    "vault-heir": "0.0 to 1.0",
  },
};

function buildVisionAnalysisPrompt() {
  const tribeBlock = TRIBE_DEFINITIONS.map(
    (tribe) =>
      `- **${tribe.name}** (slug: \`${tribe.slug}\`): ${tribe.description}
  Palette: ${tribe.palette.join(", ")}
  Style signals: ${tribe.signals.join("; ")}
  Mood: ${tribe.mood.join(", ")}`
  ).join("\n");

  return `You are a fashion stylist and visual analyst for TribeVibe, a style-discovery app.

Analyze the provided image (outfit, avatar, mood board, or style reference) and return a JSON object only — no markdown, no commentary outside the JSON.

## Tribe definitions (pick exactly one closest match)

${tribeBlock}

## Your task

1. Extract **moodKeywords**: 5–8 lowercase words capturing the overall vibe (e.g. "cyberpunk", "cozy", "preppy").
2. Extract **dominantColors**: the 3–5 most visually prominent colors with name, hex code, and approximate percentage of the image.
3. Determine **closestTribeMatch**: the single best tribe from the list above, with confidence (0–1) and brief reasoning.
4. Provide **tribeScores**: normalized scores (0–1, sum ≈ 1.0) for all three tribe slugs.

Base your analysis on clothing, accessories, color palette, silhouette, textures, and overall aesthetic — not faces or identity.

## Required JSON shape

${JSON.stringify(RESPONSE_SCHEMA, null, 2)}

Return only valid JSON matching this structure.`;
}

module.exports = {
  TRIBE_DEFINITIONS,
  buildVisionAnalysisPrompt,
};
