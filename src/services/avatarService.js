const supabase = require("../config/supabase");

const create = async ({
  userId,
  name,
  gender,
  hair,
  skin_color,
  body_type,
}) => {

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

module.exports = {
  create,
};