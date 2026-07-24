const supabase = require("../config/supabase");
// const groq = require("../config/groq");
// const { createStylistPrompt } = require("../prompts/stylistPrompt");
const groq = require("../config/groq");
const { getStylistOutfit } = require("../prompts/stylistPrompt");
const generateStylistResponse = async ({
  userId,
  occasion,
  budget,
  weather,
}) => {

  // 1. Get user's active tribe
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("active_tribe_id")
    .eq("id", userId)
    .single();

  if (profileError) {
    throw new Error(profileError.message);
  }

  // 2. Fetch products from user's active tribe
  const { data: products, error: productError } = await supabase
    .from("products")
    .select(`
  id,
  full_name,
  category,
  price,
  brand,
  color,
  image_url,
  product_url
`)
    .eq("primary_tribe_id", profile.active_tribe_id)
    .order("rating", { ascending: false })
    .limit(20);

  if (productError) {
    throw new Error(productError.message);
  }

  // Remove products exceeding budget
  const filteredProducts = products.filter(product => {
    return Number(product.price) <= Number(budget);
  });
const aiProducts = filteredProducts.map(product => ({
  id: product.id,
  name: product.full_name,
  category: product.category,
  price: product.price,
  brand: product.brand,
  color: product.color,
}));
const aiResponse = await getStylistOutfit(groq, {
  occasion,
  budget,
  weather,
  products: aiProducts,
});
  // Temporary recommendation (will be replaced by AI)
//   const recommendedProducts = filteredProducts.slice(0, 5);

//   return {
//     occasion,
//     budget,
//     weather,
//     reason:
//       "Recommended products from your active tribe matching your budget.",
//     products: recommendedProducts,
//   };
// };
// Create AI Prompt
// const prompt = createStylistPrompt({
//   occasion,
//   budget,
//   weather,
//   products: filteredProducts,
// });
// const prompt = createStylistPrompt({
//   occasion,
//   budget,
//   weather,
//   products: aiProducts,
// });
// // 👇 Debug 1
// console.log("========== PROMPT ==========");
// console.log("Prompt length:", prompt.length);
// console.log("============================");

// // Call Groq
// const completion = await groq.chat.completions.create({
//   model: "llama-3.3-70b-versatile",
//   messages: [
//     {
//       role: "system",
//       content: prompt,
//     },
//   ],
//   temperature: 0.4,
// });
// // 👇 Debug 2
// console.log("========== GROQ RESPONSE ==========");
// console.log("Completion received:", !!completion);
// console.log(completion.choices?.[0]?.message?.content);
// console.log("==================================");
// // Parse AI Response
// let aiResponse;

// // try {
// //   aiResponse = JSON.parse(
// //     completion.choices[0].message.content
// //   );
// // }
// const rawResponse = completion.choices[0].message.content;

// console.log("========== RAW GROQ RESPONSE ==========");
// console.log(rawResponse);
// console.log("=======================================");

// try {
//   aiResponse = JSON.parse(rawResponse);
// } catch (err) {
//   console.error("AI JSON Parse Error");
//   console.error(rawResponse);
//   throw new Error("AI returned invalid JSON.");
// }
 

// Match selected ids to products
const recommendedProducts = filteredProducts.filter(product =>
  aiResponse.selectedProductIds.includes(product.id)
);

return {
  occasion,
  budget,
  weather,
  reason: aiResponse.reason,
  products: recommendedProducts,
};
};
module.exports = {
  generateStylistResponse,
};