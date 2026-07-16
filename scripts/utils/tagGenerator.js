const generateTags = (text = "") => {
  const input = text.toLowerCase();

  const tags = [];

  const keywords = {
    cargo: "cargo",
    oversized: "oversized",
    floral: "floral",
    embroidered: "embroidered",
    denim: "denim",
    ripped: "ripped",
    graphic: "graphic",
    hoodie: "hoodie",
    blazer: "blazer",
    formal: "formal",
    kurta: "kurta",
    dress: "dress",
    skirt: "skirt",
    jeans: "jeans",
    jacket: "jacket",
    trousers: "trousers",
    shirt: "shirt",
    sneakers: "sneakers",
    sandals: "sandals",
    heels: "heels",
    cotton: "cotton",
    linen: "linen",
    knitted: "knitted",
    crochet: "crochet",
    satin: "satin",
    y2k: "y2k",
    streetwear: "streetwear",
    minimalist: "minimalist",
  };

  Object.entries(keywords).forEach(([keyword, tag]) => {
    if (input.includes(keyword)) {
      tags.push(tag);
    }
  });

  return [...new Set(tags)];
};

module.exports = generateTags;