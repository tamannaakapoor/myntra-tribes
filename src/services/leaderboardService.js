const supabase = require("../config/supabase");

const getLeaderboardService = async () => {

  // Get top 50 profiles
  const { data: profiles, error } = await supabase
    .from("profiles")
    .select("*")
    .order("points", { ascending: false })
    .limit(50);

  if (error) throw error;

  const leaders = await Promise.all(

    profiles.map(async (profile, index) => {

      // Avatar
      const { data: avatar } = await supabase
        .from("avatars")
        .select("skin_color,hair,body_type,gender")
        .eq("user_id", profile.id)
        .maybeSingle();

      // Tribe
      let tribe = null;

      if (profile.active_tribe_id) {

        const { data: tribeData } = await supabase
          .from("tribes")
          .select("name")
          .eq("id", profile.active_tribe_id)
          .maybeSingle();

        tribe = tribeData?.name || null;
      }

      return {

        rank: index + 1,

        username: profile.username,

        points: profile.points,

        tribe,

        avatar,

      };

    })

  );

  return leaders;
};

module.exports = {
  getLeaderboardService,
};