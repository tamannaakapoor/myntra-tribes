const fs = require("fs");

const products = require("./output/products.json");

const cleaned = [];

const seen = new Set();

for (const product of products) {

    if (!product.myntra_id) continue;

    if (seen.has(product.myntra_id)) continue;

    if (!product.image_url) continue;

    if (!product.price || product.price <= 0) continue;

    seen.add(product.myntra_id);

    cleaned.push({

        myntra_id: product.myntra_id,

        brand: product.brand.trim(),

        name: product.name.trim(),

        full_name: product.full_name.trim(),

        price: Number(product.price),

        rating: product.rating || "",

        discount: product.discount || "",

        image_url: product.image_url,

        product_url: product.product_url,

        category: product.category,

        slot: product.slot,

        gender: product.gender,

        color: product.color,

        primary_tribe_id: product.primary_tribe_id

    });

}

fs.writeFileSync(
    "./scripts/output/cleanProducts.json",
    JSON.stringify(cleaned, null, 2)
);

console.log(`Clean Products : ${cleaned.length}`);