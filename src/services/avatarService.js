const supabase = require("../config/supabase");

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

  if (existingAvatar) {
    throw new Error("Avatar already exists for this user");
  }

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

  return data;
};
const getMyAvatar = async (userId) => {
  const { data, error } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;

  return data;
};

module.exports = {
  createAvatar,
  getMyAvatar,
};