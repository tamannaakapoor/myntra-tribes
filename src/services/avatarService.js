
// const createAvatar = async ({
//   userId,
//   name,
//   gender,
//   hair,
//   skin_color,
//   body_type,
// }) => {
//   const { data, error } = await supabase
//     .from("avatars")
//     .insert({
//       user_id: userId,
//       name,
//       gender,
//       hair,
//       skin_color,
//       body_type,
//       follower_count: 0,
//       is_drop_active: false,
//       drop_ends_at: null,
//     })
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// };
// const createAvatar = async ({
//   userId,
//   name,
//   gender,
//   hair,
//   skin_color,
//   body_type,
// }) => {

//   // Check if avatar already exists
//   const { data: existingAvatar } = await supabase
//     .from("avatars")
//     .select("id")
//     .eq("user_id", userId)
//     .maybeSingle();

//   if (existingAvatar) {
//     throw new Error("Avatar already exists for this user");
//   }

//   const { data, error } = await supabase
//     .from("avatars")
//     .insert({
//       user_id: userId,
//       name,
//       gender,
//       hair,
//       skin_color,
//       body_type,
//       follower_count: 0,
//       is_drop_active: false,
//       drop_ends_at: null,
//     })
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// };
const supabase = require("../config/supabase");

const createAvatar = async ({
  userId,
  name,
  gender,
  hair,
  skin_color,
  body_type,
}) => {

  // Check if avatar already exists
  const { data: existingAvatar } = await supabase
    .from("avatars")
    .select("id")
    .eq("user_id", userId)
    .maybeSingle();

  // ---------------- UPDATE ----------------
  // if (existingAvatar) {
  //   const { data, error } = await supabase
  //     .from("avatars")
  //     .update({
  //       name,
  //       gender,
  //       hair,
  //       skin_color,
  //       body_type,
  //     })
  //     .eq("id", existingAvatar.id)
  //     .select()
  //     .single();

  //   if (error) throw error;

  //   return data;
  // }
  if (existingAvatar) {
  const { data, error } = await supabase
    .from("avatars")
    .update({
      name,
      gender,
      hair,
      skin_color,
      body_type,
    })
    .eq("id", existingAvatar.id)
    .select()
    .single();

  if (error) throw error;

  return {
    avatar: data,
    isNew: false,
  };
}

  // ---------------- CREATE ----------------
//   const { data, error } = await supabase
//     .from("avatars")
//     .insert({
//       user_id: userId,
//       name,
//       gender,
//       hair,
//       skin_color,
//       body_type,
//       follower_count: 0,
//       is_drop_active: false,
//       drop_ends_at: null,
//     })
//     .select()
//     .single();

//   if (error) throw error;

//   return data;
// };
const { data, error } = await supabase
  .from("avatars")
  .insert({
    user_id: userId,
    name,
    gender,
    hair,
    skin_color,
    body_type,
    follower_count: 0,
    is_drop_active: false,
    drop_ends_at: null,
  })
  .select()
  .single();

if (error) throw error;

return {
  avatar: data,
  isNew: true,
};

};   // <-- This was missing

// const getMyAvatar = async (userId) => {
//   const { data, error } = await supabase
//     .from("avatars")
//     .select("*")
//     .eq("user_id", userId)
//     .single();

//   if (error) throw error;

//   return data;
// };
const getMyAvatar = async (userId) => {
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error) throw error;

  return data;
};
module.exports = {
  createAvatar,
  getMyAvatar,
};