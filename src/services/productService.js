const supabase = require("../config/supabase");

// Get all products (paginated)
const getProducts = async (page = 1, limit = 20) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return await supabase
    .from("products")
    .select("*", { count: "exact" })
    .range(from, to);
};

// Filter by tribe
const getProductsByTribe = async (tribeId, page = 1, limit = 20) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("primary_tribe_id", tribeId)
    .range(from, to);
};

// Filter by category
const getProductsByCategory = async (category, page = 1, limit = 20) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return await supabase
    .from("products")
    .select("*", { count: "exact" })
    .eq("category", category)
    .range(from, to);
};

// Search
const searchProducts = async (search, page = 1, limit = 20) => {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  return await supabase
    .from("products")
    .select("*", { count: "exact" })
    .ilike("full_name", `%${search}%`)
    .range(from, to);
};

module.exports = {
  getProducts,
  getProductsByTribe,
  getProductsByCategory,
  searchProducts,
};