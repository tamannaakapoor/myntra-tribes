const supabase = require("../config/supabase");
const { addPoints } = require("./pointService");

const voteLookbook = async (userId, lookbookId) => {

    // Get avatar that owns the lookbook
    const { data: lookbook, error } = await supabase
        .from("lookbooks")
        .select("avatar_id")
        .eq("id", lookbookId)
        .single();

    if (error) throw error;

    // Get user who owns that avatar
    const { data: avatar, error: avatarError } = await supabase
        .from("avatars")
        .select("user_id")
        .eq("id", lookbook.avatar_id)
        .single();

    if (avatarError) throw avatarError;

    // Prevent self-voting
    if (avatar.user_id === userId) {
        throw new Error("You cannot vote for your own lookbook.");
    }

    // Store vote
    const { error: voteError } = await supabase
        .from("votes")
        .insert({
            user_id: userId,
            lookbook_id: lookbookId,
        });

    if (voteError) {
        if (voteError.code === "23505") {
            throw new Error("You have already voted for this lookbook.");
        }
        throw voteError;
    }

    // Reward creator
    await addPoints(avatar.user_id, 10);

    return true;
};

module.exports = {
    voteLookbook,
};