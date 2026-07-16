const supabase = require("../config/supabase");

// Find avatar belonging to logged-in user
// const getAvatarByUserId = async (userId) => {
//   const { data, error } = await supabase
//     .from("avatars")
//     .select("id")
//     .eq("user_id", userId)
//     .single();

//   if (error) throw error;

//   return data;
// };
const getAvatarByUserId = async (userId) => {
  const { data, error } = await supabase
    .from("avatars")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};
// Create a new lookbook
const createLookbook = async ({
  avatarId,
  title,
  description,
  tags,
}) => {
  const { data, error } = await supabase
    .from("lookbooks")
    .insert({
      avatar_id: avatarId,
      title,
      description,
      tags,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
};

// Save selected products
// const addLookbookItems = async (lookbookId, products) => {
//   const rows = products.map((item) => ({
//     lookbook_id: lookbookId,
//     product_id: item.product_id,
//     slot: item.slot,
//   }));

//   const { data, error } = await supabase
//     .from("lookbook_items")
//     .insert(rows)
//     .select();

//   if (error) throw error;

//   return data;
// };
const addLookbookItems = async (lookbookId, products) => {
  const rows = products.map((productId) => ({
    lookbook_id: lookbookId,
    product_id: productId,
  }));

  const { data, error } = await supabase
    .from("lookbook_items")
    .insert(rows)
    .select();

  if (error) throw error;

  return data;
};

const getMyLookbooks = async (userId) => {
  // Find avatar
  const avatar = await getAvatarByUserId(userId);

  if (!avatar) {
    return [];
  }

  const { data, error } = await supabase
    .from("lookbooks")
    .select("*")
    .eq("avatar_id", avatar.id)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data;
};

const getLookbookById = async (lookbookId) => {
  const { data, error } = await supabase
    .from("lookbooks")
    .select(`
      *,
      avatars(*),
      lookbook_items(
        products(*)
      )
    `)
    .eq("id", lookbookId)
    .maybeSingle();

  if (error) throw error;

  return data;
};
module.exports = {
  getAvatarByUserId,
  createLookbook,
  addLookbookItems,
    getMyLookbooks,
     getLookbookById,

};