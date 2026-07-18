const supabase = require("../config/supabase");

const addPoints = async (userId, pointsToAdd) => {
  // Fetch current points
  const { data: profile, error } = await supabase
    .from("profile")
    .select("points")
    .eq("id", userId)
    .single();

  if (error) throw error;

  const currentPoints = profile.points || 0;

  // Update points
  const { error: updateError } = await supabase
    .from("profile")
    .update({
      points: currentPoints + pointsToAdd,
    })
    .eq("id", userId);

  if (updateError) throw updateError;
};

module.exports = {
  addPoints,
};