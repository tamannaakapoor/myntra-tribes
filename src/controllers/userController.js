// const userService = require("../services/userService");

// const updateTribe = async (req, res) => {
//   try {
//     const { tribe_name } = req.body;

//     if (!tribe_name) {
//       return res.status(400).json({
//         success: false,
//         message: "tribe_name is required",
//       });
//     }

//     const user = await userService.updateUserTribe(
//       req.user.id,
//       tribe_name
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Tribe updated successfully",
//       user,
//     });

//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// module.exports = {
//   updateTribe,
// };
// const userService = require("../services/userService");
// const supabase = require("../config/supabase"); // <--- VITAL: Added missing DB import!

// const updateTribe = async (req, res) => {
//   try {
//     const { tribe_name } = req.body;

//     if (!tribe_name) {
//       return res.status(400).json({
//         success: false,
//         message: "tribe_name is required",
//       });
//     }

//     const user = await userService.updateUserTribe(
//       req.user.id,
//       tribe_name
//     );

//     return res.status(200).json({
//       success: true,
//       message: "Tribe updated successfully",
//       user,
//     });

//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// const awardPoints = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { amount } = req.body;

//     if (!amount) return res.status(400).json({ success: false, message: "Amount required" });

//     // Fetch current points
//     const { data: profile, error: fetchError } = await supabase
//       .from("profiles") 
//       .select("points")
//       .eq("id", userId)
//       .single();

//     if (fetchError) throw fetchError;

//     const newPoints = Math.max(0, (profile.points || 0) + amount);

//     // Update with rewarded points
//     const { error: updateError } = await supabase
//       .from("profiles")
//       .update({ points: newPoints })
//       .eq("id", userId);

//     if (updateError) throw updateError;

//     return res.status(200).json({ success: true, message: "Points awarded", points: newPoints });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };
// const awardPoints = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const { amount } = req.body;

//     if (!amount) return res.status(400).json({ success: false, message: "Amount required" });

//     // Fetch current points
//     const { data: profile, error: fetchError } = await supabase
//       .from("profiles") // Change to "users" if that is your table name
//       .select("points")
//       .eq("id", userId)
//       .single();

//     if (fetchError) throw fetchError;

//     const newPoints = Math.max(0, (profile.points || 0) + amount);

//     // Update with rewarded points
//     const { error: updateError } = await supabase
//       .from("profiles")
//       .update({ points: newPoints })
//       .eq("id", userId);

//     if (updateError) throw updateError;

//     return res.status(200).json({ success: true, message: "Points awarded", points: newPoints });
//   } catch (err) {
//     console.error(err);
//     return res.status(500).json({ success: false, message: err.message });
//   }
// };

// module.exports = {
//   updateTribe,
//   awardPoints, 
// };
const userService = require("../services/userService");
const supabase = require("../config/supabase"); // <--- VITAL: Added missing DB import!

const updateTribe = async (req, res) => {
  try {
    const { tribe_name } = req.body;

    if (!tribe_name) {
      return res.status(400).json({
        success: false,
        message: "tribe_name is required",
      });
    }

    const user = await userService.updateUserTribe(
      req.user.id,
      tribe_name
    );

    return res.status(200).json({
      success: true,
      message: "Tribe updated successfully",
      user,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

const awardPoints = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount } = req.body;

    if (!amount) return res.status(400).json({ success: false, message: "Amount required" });

    // Fetch current points
    const { data: profile, error: fetchError } = await supabase
      .from("profiles") 
      .select("points")
      .eq("id", userId)
      .single();

    if (fetchError) throw fetchError;

    const newPoints = Math.max(0, (profile.points || 0) + amount);

    // Update with rewarded points
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ points: newPoints })
      .eq("id", userId);

    if (updateError) throw updateError;

    return res.status(200).json({ success: true, message: "Points awarded", points: newPoints });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = {
  updateTribe,
  awardPoints, 
};