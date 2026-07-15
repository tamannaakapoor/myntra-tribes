const { chromium } = require("playwright");
const fs = require("fs");
const categories = require("./categories");
// const tribeMap = require("./tribeMap");
const classifyTribe = require("./utils/tribeClassifier");
const tribeMap = require("./tribeMap");

const allProducts = [];

(async () => {
  const browser = await chromium.launch({
    headless: false,
    slowMo: 100,
  });

  const page = await browser.newPage({
    viewport: {
      width: 1440,
      height: 900,
    },
  });

  for (const cat of categories) {
    console.log("\n==================================");
    console.log(`Scraping ${cat.category}`);
    console.log("==================================");

    // Retry opening category
    let loaded = false;

    while (!loaded) {
      try {
        await page.goto(cat.url, {
          waitUntil: "domcontentloaded",
          timeout: 60000,
        });

        await page.waitForTimeout(3000);

        loaded = true;
      } catch (err) {
        console.log("Retrying page...");
      }
    }

    // Infinite scroll
    let previousCount = 0;
    let sameCount = 0;

    while (true) {
      const currentCount = await page.$$eval(
        "li.product-base",
        (items) => items.length
      );

      console.log(`Products Loaded : ${currentCount}`);

      if (currentCount === previousCount) {
        sameCount++;
      } else {
        sameCount = 0;
      }

      if (sameCount >= 3) break;

      previousCount = currentCount;

      await page.evaluate(() => {
        window.scrollBy(0, window.innerHeight * 2);
      });

      await page.waitForTimeout(1500);
    }

    console.log("Finished Scrolling");

    const products = await page.$$eval(
      "li.product-base",
      (cards, meta) => {
        return cards.map((card) => {
          const brand =
            card.querySelector(".product-brand")?.innerText.trim() || "";

          const productName =
            card.querySelector(".product-product")?.innerText.trim() || "";

          const discountedPrice =
            card.querySelector(".product-discountedPrice")?.innerText || "";

          const originalPrice =
            card.querySelector(".product-price")?.innerText || "";

          const rating =
            card.querySelector(".product-ratingsContainer span")
              ?.innerText || "";

          const discount =
            card.querySelector(".product-discountPercentage")
              ?.innerText || "";

          const imgElement = card.querySelector("img");

          const image =
            imgElement?.getAttribute("data-src") ||
            imgElement?.src ||
            "";

          const anchor = card.querySelector("a");

          const link = anchor?.href || "";

          let myntraId = "";

          const idMatch = link.match(/\/(\d+)(?:\/|$)/);

          if (idMatch) {
            myntraId = idMatch[1];
          }

          const priceText = discountedPrice || originalPrice;

          const price = Number(
            priceText.replace(/[^\d]/g, "")
          );

          // return {
          //   myntra_id: myntraId,
          //   brand,
          //   name: productName,
          //   full_name: `${brand} ${productName}`,
          //   price,
          //   rating,
          //   discount,
          //   image_url: image,
          //   category: meta.category,
          //   gender: meta.gender,
          //   primary_tribe_id: meta.tribeId,
          //   product_url: link,
          // };
          return {
  myntra_id: myntraId,
  brand,
  name: productName,
  full_name: `${brand} ${productName}`,
  price,
  rating,
  discount,
  image_url: image,
  category: meta.category,
  gender: meta.gender,
  product_url: link,
};
        });
      },
      
        // category: cat.category,
        // gender: cat.gender,
        // tribeId: tribeMap[cat.tribe],
        {
  category: cat.category,
  gender: cat.gender,
}
      
    );

    console.log(`Found ${products.length} products`);
    const enrichedProducts = products.map((product) => {
  // const tribe = classifyTribe(product.full_name);
  const tribe = classifyTribe(
    `${product.brand} ${product.name}`
);

  return {
    ...product,
    primary_tribe_id: tribeMap[tribe],
  };
});

    const validProducts = enrichedProducts.filter(
      (p) =>
        p.myntra_id &&
        p.image_url &&
        p.name &&
        p.price > 0
    );

    console.log(`Valid Products : ${validProducts.length}`);

    allProducts.push(...validProducts);

    // Save progress after every category
    fs.writeFileSync(
      "./scripts/output/products.json",
      JSON.stringify(allProducts, null, 2)
    );

    console.log(
      `Saved progress (${allProducts.length} products)`
    );
  }

  // Remove duplicates
  const uniqueProducts = [
    ...new Map(
      allProducts.map((product) => [
        product.myntra_id,
        product,
      ])
    ).values(),
  ];

  fs.writeFileSync(
    "./scripts/output/products.json",
    JSON.stringify(uniqueProducts, null, 2)
  );

  console.log("\n==================================");
  console.log(`Total Products : ${allProducts.length}`);
  console.log(`Unique Products : ${uniqueProducts.length}`);
  console.log("==================================");

  await browser.close();
})();