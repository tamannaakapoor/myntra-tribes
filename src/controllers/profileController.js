const supabase = require("../config/supabase");

// GET /api/user/me
const getUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { data, error } = await supabase
      .from("profiles")
      .select(`
        username,
        points,
        shipping_address
      `)
      .eq("id", userId)
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      user: data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// PUT /api/user/me
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;

    const { shipping_address } = req.body;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        shipping_address,
      })
      .eq("id", userId)
      .select()
      .single();

    if (error) throw error;

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: data,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile,
};