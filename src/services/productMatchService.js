const supabase = require("../config/supabase");

const VALID_TRIBE_SLUGS = ["neon-static", "golden-hour", "vault-heir"];

const TAG_ALIASES = {
  edgy: ["oversized", "graphic", "printed", "bold", "street"],
  futuristic: ["metallic", "chrome", "neon", "tech"],
  cyberpunk: ["neon", "graphic", "oversized", "black", "purple"],
  rebellious: ["graphic", "printed", "oversized"],
  urban: ["street", "oversized", "sneaker", "hoodie"],
  bold: ["printed", "graphic", "oversized", "bright"],
  warm: ["cream", "beige", "terracotta", "gold", "brown"],
  romantic: ["floral", "dress", "soft", "lace"],
  soft: ["cotton", "lounge", "pastel", "flowy"],
  natural: ["cotton", "linen", "earth", "green"],
  dreamy: ["pastel", "floral", "soft", "flowy"],
  bohemian: ["floral", "print", "embroidered", "ethnic"],
  refined: ["formal", "tailored", "classic", "solid"],
  elegant: ["formal", "silk", "tailored", "dress"],
  preppy: ["polo", "collar", "shirt", "striped"],
  luxurious: ["leather", "watch", "designer", "premium"],
  timeless: ["classic", "solid", "formal", "leather"],
  polished: ["formal", "shirt", "trouser", "blazer"],
  streetwear: ["oversized", "hoodie", "sneaker", "graphic"],
  cozy: ["lounge", "hoodie", "sweatshirt", "wool"],
  vintage: ["retro", "classic", "denim"],
};

const CATEGORY_HINTS = {
  sneaker: ["Sports Shoes", "Sneakers"],
  sneakers: ["Sports Shoes", "Sneakers"],
  loafer: ["Casual Shoes"],
  loafers: ["Casual Shoes"],
  sandal: ["Sandals"],
  sandals: ["Sandals"],
  dress: ["Dresses"],
  hoodie: ["Hoodies", "Sweatshirts"],
  watch: ["Watches"],
  chain: ["Jewellery"],
  chains: ["Jewellery"],
  jewellery: ["Jewellery"],
  jewelry: ["Jewellery"],
  bag: ["Handbags", "Backpacks"],
  handbag: ["Handbags"],
  backpack: ["Backpacks"],
  sunglasses: ["Sunglasses"],
  shirt: ["Shirts", "T-Shirts"],
  tee: ["T-Shirts"],
  tshirt: ["T-Shirts"],
  jean: ["Jeans"],
  jeans: ["Jeans"],
  trouser: ["Trousers"],
  trousers: ["Trousers"],
  heel: ["Heels"],
  heels: ["Heels"],
  kurta: ["Kurtas"],
  skirt: ["Skirts"],
};

function normalizeTerm(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "");
}

function buildTagSet(analysis) {
  const tags = new Map();

  const addTag = (term, weight = 1) => {
    const normalized = normalizeTerm(term);
    if (!normalized || normalized.length < 2) return;

    tags.set(normalized, Math.max(tags.get(normalized) || 0, weight));

    for (const word of normalized.split(/\s+/)) {
      if (word.length >= 3) {
        tags.set(word, Math.max(tags.get(word) || 0, weight * 0.85));
      }
    }
  };

  for (const keyword of analysis.moodKeywords || []) {
    addTag(keyword, 1);
    for (const alias of TAG_ALIASES[normalizeTerm(keyword)] || []) {
      addTag(alias, 0.75);
    }
  }

  for (const color of analysis.dominantColors || []) {
    addTag(color.name, 1.2);
  }

  return tags;
}

function productSearchableText(product) {
  return [
    product.full_name,
    product.name,
    product.brand,
    product.category,
    product.color,
    product.slot,
    product.gender,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function scoreTagOverlap(product, tagSet) {
  const text = productSearchableText(product);
  const matchedTags = [];
  let score = 0;

  for (const [term, weight] of tagSet.entries()) {
    if (text.includes(term)) {
      score += 8 * weight;
      matchedTags.push(term);
      continue;
    }

    const categories = CATEGORY_HINTS[term];
    if (categories?.includes(product.category)) {
      score += 6 * weight;
      matchedTags.push(`${term}→${product.category}`);
    }
  }

  return { score, matchedTags };
}

function scoreTribeOverlap(product, analysis, slugToId) {
  const matchedTags = [];
  let score = 0;

  const primarySlug = analysis.closestTribeMatch?.slug;
  const primaryId = analysis.closestTribeMatch?.id || slugToId[primarySlug];
  const confidence = analysis.closestTribeMatch?.confidence ?? 1;

  if (primaryId && product.primary_tribe_id === primaryId) {
    score += 35 * confidence;
    matchedTags.push(`tribe:${primarySlug}`);
  }

  for (const slug of VALID_TRIBE_SLUGS) {
    if (slug === primarySlug) continue;

    const tribeId = slugToId[slug];
    const tribeScore = analysis.tribeScores?.[slug] ?? 0;

    if (tribeId && product.primary_tribe_id === tribeId && tribeScore > 0) {
      score += 15 * tribeScore;
      matchedTags.push(`tribe:${slug}`);
    }
  }

  return { score, matchedTags };
}

function scoreProduct(product, analysis, slugToId, tagSet) {
  const tribe = scoreTribeOverlap(product, analysis, slugToId);
  const tags = scoreTagOverlap(product, tagSet);

  const matchScore = Number((tribe.score + tags.score).toFixed(2));
  const matchedTags = [...new Set([...tribe.matchedTags, ...tags.matchedTags])];

  return {
    ...product,
    matchScore,
    matchedTags,
    matchBreakdown: {
      tribeScore: Number(tribe.score.toFixed(2)),
      tagScore: Number(tags.score.toFixed(2)),
    },
  };
}

async function loadTribeSlugMap() {
  const { data, error } = await supabase
    .from("tribes")
    .select("id, slug")
    .in("slug", VALID_TRIBE_SLUGS);

  if (error) throw error;

  return Object.fromEntries(data.map((tribe) => [tribe.slug, tribe.id]));
}

function getCandidateTribeIds(analysis, slugToId) {
  const ids = new Set();

  const primarySlug = analysis.closestTribeMatch?.slug;
  if (primarySlug && slugToId[primarySlug]) {
    ids.add(slugToId[primarySlug]);
  }

  for (const slug of VALID_TRIBE_SLUGS) {
    const score = analysis.tribeScores?.[slug] ?? 0;
    if (score >= 0.15 && slugToId[slug]) {
      ids.add(slugToId[slug]);
    }
  }

  return [...ids];
}

async function fetchCandidateProducts(tribeIds) {
  if (tribeIds.length === 0) {
    const { data, error } = await supabase.from("products").select("*").limit(250);
    if (error) throw error;
    return data || [];
  }

  const { data, error } = await supabase
    .from("products")
    .select("*")
    .in("primary_tribe_id", tribeIds)
    .limit(400);

  if (error) throw error;
  return data || [];
}

async function matchProductsByTags(analysis, { limit = 12 } = {}) {
  if (!analysis?.moodKeywords?.length) {
    throw new Error("moodKeywords are required for product matching");
  }

  if (!analysis?.closestTribeMatch?.slug) {
    throw new Error("closestTribeMatch.slug is required for product matching");
  }

  const slugToId = await loadTribeSlugMap();

  if (!analysis.closestTribeMatch.id && slugToId[analysis.closestTribeMatch.slug]) {
    analysis.closestTribeMatch.id = slugToId[analysis.closestTribeMatch.slug];
  }

  const tagSet = buildTagSet(analysis);
  const tribeIds = getCandidateTribeIds(analysis, slugToId);
  const candidates = await fetchCandidateProducts(tribeIds);

  const ranked = candidates
    .map((product) => scoreProduct(product, analysis, slugToId, tagSet))
    .filter((product) => product.matchScore > 0)
    .sort((a, b) => b.matchScore - a.matchScore)
    .slice(0, limit);

  return {
    count: ranked.length,
    tagsUsed: [...tagSet.keys()],
    candidatePool: candidates.length,
    products: ranked,
  };
}

module.exports = {
  matchProductsByTags,
  buildTagSet,
  scoreProduct,
};
