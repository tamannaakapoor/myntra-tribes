const products = require("./output/products.json");

const categoryCount = {};
const tribeCount = {};

for (const p of products) {
  categoryCount[p.category] = (categoryCount[p.category] || 0) + 1;
  tribeCount[p.primary_tribe_id] = (tribeCount[p.primary_tribe_id] || 0) + 1;
}

console.log("Category Distribution");
console.table(categoryCount);

console.log("\nTribe Distribution");
console.table(tribeCount);