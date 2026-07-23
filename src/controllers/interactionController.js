const supabase = require("../config/supabase");

// POST /api/lookbooks/:id/comments
const postComment = async (req, res) => {
  try {
    const lookbook_id = req.params.id;
    const user_id = req.user.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const { data, error } = await supabase
      .from("comments")
      .insert({
        lookbook_id,
        user_id,
        text,
      })
      .select(`
        *,
        profiles(
          username
        )
      `)
      .single();

    if (error) throw error;

    return res.status(201).json({
      success: true,
      comment: data,
    });

  } catch (err) {

    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};