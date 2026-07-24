// const supabase = require("../config/supabase");


// const getAvatarByUserId = async (userId) => {
//   const { data, error } = await supabase
//     .from("avatars")
//     .select("id")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   if (error) throw error;

//   return data;
// };

// const createLookbook = async ({
//   avatarId,
//   tribeId,
//   title,
//   description,
//   tags,
// }) => {
//   const { data, error } = await supabase
//     .from("lookbooks")
//     .insert({
//       avatar_id: avatarId,
//       tribe_id: tribeId,
//       title,
//       description,
//       tags,
//     })
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// };

// const addLookbookItems = async (lookbookId, products) => {
//   const rows = products.map((productId) => ({
//     lookbook_id: lookbookId,
//     product_id: productId,
//   }));

//   const { data, error } = await supabase
//     .from("lookbook_items")
//     .insert(rows)
//     .select();

//   if (error) throw error;

//   return data;
// };

// const getMyLookbooks = async (userId) => {
//   // Find avatar
//   const avatar = await getAvatarByUserId(userId);

//   if (!avatar) {
//     return [];
//   }

//   const { data, error } = await supabase
//     .from("lookbooks")
//     .select("*")
//     .eq("avatar_id", avatar.id)
//     .order("created_at", { ascending: false });

//   if (error) throw error;

//   return data;
// };


// const getLookbookById = async (lookbookId) => {
//   // Get lookbook
//   const { data: lookbook, error } = await supabase
//     .from("lookbooks")
//     .select("*")
//     .eq("id", lookbookId)
//     .maybeSingle();

//   if (error) throw error;
//   if (!lookbook) return null;

//   // Get avatar
//   const { data: avatar, error: avatarError } = await supabase
//     .from("avatars")
//     .select("*")
//     .eq("id", lookbook.avatar_id)
//     .maybeSingle();

//   if (avatarError) throw avatarError;

//   let profile = null;
//   let tribe = null;

//   if (avatar) {
//     // Get profile
//     const { data: profileData, error: profileError } = await supabase
//       .from("profiles")
//       .select("username, active_tribe_id")
//       .eq("id", avatar.user_id)
//       .maybeSingle();

//     if (profileError) throw profileError;

//     profile = profileData;

//     // Get tribe only if assigned
//     if (profile?.active_tribe_id) {
//       const { data: tribeData, error: tribeError } = await supabase
//         .from("tribes")
//         .select("id, name, slug")
//         .eq("id", profile.active_tribe_id)
//         .maybeSingle();

//       if (tribeError) throw tribeError;

//       tribe = tribeData;
//     }
//   }

//   // Get products
//   const { data: items, error: itemsError } = await supabase
//     .from("lookbook_items")
//     .select(`
//       product:products(
//         id,
//         name,
//         brand,
//         price,
//         rating,
//         discount,
//         image_url,
//         product_url,
//         category
//       )
//     `)
//     .eq("lookbook_id", lookbookId);

//   if (itemsError) throw itemsError;

//   return {
//     ...lookbook,
//     creator: {
//       username: profile?.username || null,
//       avatar: avatar || null,
//       tribe: tribe || null,
//     },
//     products: items ? items.map((item) => item.product) : [],
//   };
// };


// const getFeed = async (tribeName) => {
//   const { data, error } = await supabase
//     .from("lookbooks")
//     .select(`
//       id,
//       title,
//       description,
//       tags,
//       created_at,

//       tribes (
//         id,
//         name,
//         slug
//       ),

//       avatars (
//         id,
//         hair,
//         skin_color,
//         body_type,
//         gender,
//         user_id
//       ),

//       lookbook_items (
//         products (
//           id,
//           name,
//           brand,
//           price,
//           discount,
//           image_url,
//           product_url,
//           category
//         )
//       )
//     `)
//     .order("created_at", { ascending: false });
//     console.log(JSON.stringify(data[0], null, 2));

//   if (error) throw error;

//   const feed = await Promise.all(
//     data.map(async (lookbook) => {

//       const { data: profile } = await supabase
//         .from("profiles")
//         .select("username")
//         .eq("id", lookbook.avatars.user_id)
//         .maybeSingle();

//       return {
//         id: lookbook.id,
//         title: lookbook.title,
//         description: lookbook.description,

//         // <-- comes directly from lookbooks.tribe_id
//         tribe: lookbook.tribes?.name || null,

//         products: lookbook.lookbook_items.map(item => item.products),

//         creator: {
//           username: profile?.username || null,

//           avatar: {
//             skin_color: lookbook.avatars.skin_color,
//             hair: lookbook.avatars.hair,
//             body_type: lookbook.avatars.body_type,
//             gender: lookbook.avatars.gender,
//           }
//         }
//       };
//     })
//   );

//   if (tribeName) {
//     return feed.filter(item => item.tribe === tribeName);
//   }

//   return feed;
// };

// // Like Lookbook
// const likeLookbook = async (userId, lookbookId) => {

//   const { error } = await supabase
//     .from("lookbook_likes")
//     .insert({
//       user_id: userId,
//       lookbook_id: lookbookId,
//     });

//   if (error) throw error;

//   return true;
// };

// // Unlike Lookbook
// const unlikeLookbook = async (userId, lookbookId) => {

//   const { error } = await supabase
//     .from("lookbook_likes")
//     .delete()
//     .eq("user_id", userId)
//     .eq("lookbook_id", lookbookId);

//   if (error) throw error;

//   return true;
// };

// const addComment = async (lookbookId, userId, text) => {

//   const { data, error } = await supabase
//     .from("comments")
//     .insert({
//       lookbook_id: lookbookId,
//       user_id: userId,
//       text,
//     })
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// };
// const getComments = async (lookbookId) => {

//   const { data, error } = await supabase
//     .from("comments")
//     .select(`
//       id,
//       text,
//       created_at,
//       profiles(
//         username
//       )
//     `)
//     .eq("lookbook_id", lookbookId)
//     .order("created_at", { ascending: true });

//   if (error) throw error;

//   return data;
// };
// module.exports = {
//   getAvatarByUserId,
//   createLookbook,
//   addLookbookItems,
//     getMyLookbooks,
//      getLookbookById,
//      getFeed,
//        likeLookbook,

//        unlikeLookbook,
//        addComment,
//        getComments,

// };

const supabase = require("../config/supabase");

// Note: getAvatarByUserId has been deleted entirely.

const createLookbook = async ({
  userId,
  tribeId,
  title,
  description,
  tags,
}) => {
  const { data, error } = await supabase
    .from("lookbooks")
    .insert({
      user_id: userId, // <--- Tied directly to user, not avatar!
      tribe_id: tribeId,
      title,
      description,
      tags,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

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
  const { data, error } = await supabase
    .from("lookbooks")
    .select("*")
    .eq("user_id", userId) // <--- Querying by user_id
    .order("created_at", { ascending: false });

  if (error) throw error;
  return data;
};

const getLookbookById = async (lookbookId) => {
  // Get lookbook
  const { data: lookbook, error } = await supabase
    .from("lookbooks")
    .select("*")
    .eq("id", lookbookId)
    .maybeSingle();

  if (error) throw error;
  if (!lookbook) return null;

  let profile = null;
  let tribe = null;

  // Get profile directly via user_id
  if (lookbook.user_id) {
    const { data: profileData, error: profileError } = await supabase
      .from("profiles")
      .select("username, active_tribe_id")
      .eq("id", lookbook.user_id)
      .maybeSingle();

    if (!profileError) profile = profileData;

    if (profile?.active_tribe_id) {
      const { data: tribeData } = await supabase
        .from("tribes")
        .select("id, name, slug")
        .eq("id", profile.active_tribe_id)
        .maybeSingle();

      tribe = tribeData;
    }
  }

  // Get products
  const { data: items, error: itemsError } = await supabase
    .from("lookbook_items")
    .select(`
      product:products(
        id, name, brand, price, rating, discount, image_url, product_url, category
      )
    `)
    .eq("lookbook_id", lookbookId);

  if (itemsError) throw itemsError;

  return {
    ...lookbook,
    creator: {
      username: profile?.username || null,
      avatar: null, // Safe fallback for frontend
      tribe: tribe || null,
    },
    products: items ? items.map((item) => item.product) : [],
  };
};

const getFeed = async (tribeName) => {
  // Removed 'avatars' from the query
  const { data, error } = await supabase
    .from("lookbooks")
    .select(`
      id, title, description, tags, created_at, user_id,
      tribes ( id, name, slug ),
      lookbook_items (
        products (
          id, name, brand, price, discount, image_url, product_url, category
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  const feed = await Promise.all(
    data.map(async (lookbook) => {
      let profile = null;

      if (lookbook.user_id) {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", lookbook.user_id)
          .maybeSingle();
        profile = profileData;
      }

      return {
        id: lookbook.id,
        title: lookbook.title,
        description: lookbook.description,
        tribe: lookbook.tribes?.name || null,
        products: lookbook.lookbook_items.map(item => item.products),
        creator: {
          username: profile?.username || "Creator",
          avatar: null // Safe fallback for frontend
        }
      };
    })
  );

  if (tribeName) {
    return feed.filter(item => item.tribe === tribeName);
  }

  return feed;
};

// Like Lookbook
const likeLookbook = async (userId, lookbookId) => {
  const { error } = await supabase
    .from("lookbook_likes")
    .insert({ user_id: userId, lookbook_id: lookbookId });
  if (error) throw error;
  return true;
};

// Unlike Lookbook
const unlikeLookbook = async (userId, lookbookId) => {
  const { error } = await supabase
    .from("lookbook_likes")
    .delete()
    .eq("user_id", userId)
    .eq("lookbook_id", lookbookId);
  if (error) throw error;
  return true;
};

const addComment = async (lookbookId, userId, text) => {
  const { data, error } = await supabase
    .from("comments")
    .insert({ lookbook_id: lookbookId, user_id: userId, text })
    .select()
    .single();
  if (error) throw error;
  return data;
};

const getComments = async (lookbookId) => {
  const { data, error } = await supabase
    .from("comments")
    .select(`
      id, text, created_at,
      profiles( username )
    `)
    .eq("lookbook_id", lookbookId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data;
};

module.exports = {
  createLookbook,
  addLookbookItems,
  getMyLookbooks,
  getLookbookById,
  getFeed,
  likeLookbook,
  unlikeLookbook,
  addComment,
  getComments,
};