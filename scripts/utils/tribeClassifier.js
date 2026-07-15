const classifyTribe = (text = "") => {
  const input = text.toLowerCase();

  // ================= NEON STATIC =================

  const neonKeywords = [
    "cargo",
    "oversized",
    "graphic",
    "street",
    "streetwear",
    "hoodie",
    "bomber",
    "denim",
    "ripped",
    "baggy",
    "wide leg",
    "wide-leg",
    "parachute",
    "utility",
    "chunky",
    "platform",
    "combat",
    "mesh",
    "metallic",
    "corset",
    "cyber",
    "y2k",
    "grunge",
    "printed tee",
    "sneakers",
    "sneaker",
    "acid wash",
    "distressed",
    "washed",
    "varsity"
  ];

  // ================= GOLDEN HOUR =================

  const goldenKeywords = [
    "dress",
    "floral",
    "maxi",
    "midi",
    "mini dress",
    "kurta",
    "ethnic",
    "cotton",
    "linen",
    "embroidered",
    "lace",
    "ruffle",
    "pastel",
    "cream",
    "beige",
    "sage",
    "knit",
    "crochet",
    "cardigan",
    "dupatta",
    "sandals",
    "handbag",
    "skirt",
    "peplum",
    "boho",
    "cottage",
    "smocked",
    "tiered"
  ];

  // ================= VAULT HEIR =================

  const vaultKeywords = [
    "blazer",
    "formal",
    "tailored",
    "trousers",
    "shirt",
    "oxford",
    "loafers",
    "watch",
    "pearl",
    "classic",
    "minimal",
    "premium",
    "structured",
    "straight fit",
    "slim fit",
    "office",
    "coat",
    "vest",
    "pleated",
    "satin",
    "monochrome",
    "solid",
    "elegant"
  ];

  if (neonKeywords.some(word => input.includes(word)))
    return "Neon Static";

  if (goldenKeywords.some(word => input.includes(word)))
    return "Golden Hour";

  if (vaultKeywords.some(word => input.includes(word)))
    return "Vault Heir";

  return "Golden Hour";
};

module.exports = classifyTribe;