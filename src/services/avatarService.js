
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
  eye_type,
  eyebrow_type,
  mouth_type,

  outfit_top,
  outfit_bottom,

  shoes,
  accessory,

  background,
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
      eye_type,
  eyebrow_type,
  mouth_type,

  outfit_top,
  outfit_bottom,

  shoes,
  accessory,

  background,
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
  // .insert({
  //   user_id: userId,
  //   name,
  //   gender,
  //   hair,
  //   skin_color,
  //   body_type,
  //   follower_count: 0,
  //   is_drop_active: false,
  //   drop_ends_at: null,
  // })
  .insert({
    user_id: userId,

    name,
    gender,

    hair,
    hair_color,

    skin_color,
    body_type,

    eye_type,
    eyebrow_type,
    mouth_type,

    outfit_top,
    outfit_bottom,

    shoes,
    accessory,

    background,

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
// const getMyAvatar = async (userId) => {
//   const { data, error } = await supabase
//     .from("avatars")
//     .select("*")
//     .eq("user_id", userId)
//     .order("created_at", { ascending: false })
//     .limit(1)
//     .maybeSingle();

//   if (error) throw error;

//   return data;
// };
const getMyAvatar = async (userId) => {

  // Avatar
  const { data: avatar, error: avatarError } = await supabase
    .from("avatars")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (avatarError) throw avatarError;

  if (!avatar) return null;

  // Profile
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("username, active_tribe_id")
    .eq("id", userId)
    .maybeSingle();

  if (profileError) throw profileError;

  let tribe = null;

  if (profile?.active_tribe_id) {

    const { data: tribeData, error: tribeError } = await supabase
      .from("tribes")
      .select("id, name, slug")
      .eq("id", profile.active_tribe_id)
      .maybeSingle();

    if (tribeError) throw tribeError;

    tribe = tribeData;
  }

  // return {

  //   id: avatar.id,

  //   hair: avatar.hair,

  //   body_type: avatar.body_type,

  //   skin_color: avatar.skin_color,

  //   gender: avatar.gender,

  //   username: profile?.username,

  //   tribe

  // };
//   return {
//   id: avatar.id,
//   name: avatar.name,
//   gender: avatar.gender,
//   hair: avatar.hair,
//   skin_color: avatar.skin_color,
//   body_type: avatar.body_type,

//   follower_count: avatar.follower_count,

//   username: profile?.username,

//   tribe,
// };
return {

  id: avatar.id,

  name: avatar.name,

  gender: avatar.gender,

  hair: avatar.hair,
  hair_color: avatar.hair_color,

  skin_color: avatar.skin_color,

  body_type: avatar.body_type,

  eye_type: avatar.eye_type,
  eyebrow_type: avatar.eyebrow_type,
  mouth_type: avatar.mouth_type,

  outfit_top: avatar.outfit_top,
  outfit_bottom: avatar.outfit_bottom,

  shoes: avatar.shoes,

  accessory: avatar.accessory,

  background: avatar.background,

  follower_count: avatar.follower_count,

  username: profile?.username,

  tribe,

};
};
module.exports = {
  createAvatar,
  getMyAvatar,
};