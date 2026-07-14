const supabase = require("../config/supabase");

const createAvatar = async ({
  userId,
  name,
}) => {

  const { data, error } = await supabase
    .from("avatars")
    // .insert({
    //   user_id: userId,
    //   name,
    //   follower_count: 0,
    //   is_drop_active: false,
    //   drop_ends_at: null,
    // })
    .insert({

    user_id:userId,

    name,

    hair,

    skin_color,

    body_type,

    follower_count:0,

    is_drop_active:false,

    drop_ends_at:null

})
    .select()
    .single();

  if (error) throw error;

  return data;
};

module.exports = {
  createAvatar,
};