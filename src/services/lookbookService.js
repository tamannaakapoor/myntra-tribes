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

const getFeed = async (tribeName) => {

  let query = supabase
    .from("lookbooks")
    .select(`
      id,
      title,
      description,
      tags,
      created_at,

      avatars(
        id,
        name,
        hair,
        skin_color,
        body_type,
        gender,
        user_id
      ),

      lookbook_items(
        products(
          image_url
        )
      )
    `)
    .order("created_at", { ascending: false });

  const { data, error } = await query;

  if (error) throw error;

  const feed = await Promise.all(
    data.map(async (lookbook) => {

      // Get profile
      const { data: profile } = await supabase
        .from("profile")
        .select("username, active_tribe_id")
        .eq("id", lookbook.avatars.user_id)
        .maybeSingle();

      let tribe = null;

      if (profile?.active_tribe_id) {

        const { data: tribeData } = await supabase
          .from("tribes")
          .select("name")
          .eq("id", profile.active_tribe_id)
          .maybeSingle();

        tribe = tribeData?.name || null;
      }

      return {

        id: lookbook.id,

        title: lookbook.title,

        description: lookbook.description,

        tribe,

        images:
          lookbook.lookbook_items.map(
            (item) => item.products.image_url
          ),

        creator: {

          handle: profile?.username,

          avatar: {

            skin_color:
              lookbook.avatars.skin_color,

            hair:
              lookbook.avatars.hair,

            body_type:
              lookbook.avatars.body_type,

            gender:
              lookbook.avatars.gender,

          },

        },

      };

    })
  );

  if (tribeName) {
    return feed.filter(
      (item) => item.tribe === tribeName
    );
  }

  return feed;
};
module.exports = {
  getAvatarByUserId,
  createLookbook,
  addLookbookItems,
    getMyLookbooks,
     getLookbookById,
     getFeed,

};