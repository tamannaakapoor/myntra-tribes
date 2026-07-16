const supabase = require("../config/supabase");

const updateUserTribe = async (userId, tribeName) => {

  // Find tribe UUID
  const { data: tribe, error: tribeError } = await supabase
    .from("tribes")
    .select("id")
    .eq("name", tribeName)
    .maybeSingle();

  if (tribeError) throw tribeError;

  if (!tribe) {
    throw new Error("Tribe not found");
  }

  // Update user profile
  const { data, error } = await supabase
    .from("profiles")
    .update({
      active_tribe_id: tribe.id,
    })
    .eq("id", userId)
    .select()
    .single();

  if (error) throw error;

  return data;
};

module.exports = {
  updateUserTribe,
};