const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const supabase = require("../config/supabase");
const {
  updateTribe,
} = require("../controllers/userController");

router.post(
  "/tribe",
  authenticateUser,
  updateTribe
);

// GET /api/user/me
// router.get('/me', authenticateUser, async (req, res) => {
//     try {
//         // Fetch the user's full row from the Supabase 'users' table
//         // const { data: user, error } = await supabase
//         //     .from('profiles')
//         //     .select('id, username, email, tribe') // Make sure 'tribe' column exists!
//         //     .eq('id', req.user.id)
//         //     .single();
//         const { data: profile, error } = await supabase
//     .from("profiles")
//     .select(`
//         id,
//         username,
//         avatar_url,
//         points,
//         tribes (
//             id,
//             name
//         )
//     `)
//     .eq("id", req.user.id)
//     .single();

//         if (error) throw error;
//         res.json({ success: true, user });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
router.get("/me", authenticateUser, async (req, res) => {
    try {

        const { data, error } = await supabase
            .from("profiles")
            .select(`
                id,
                username,
                avatar_url,
                points,
                tribes!active_tribe_id (
                    id,
                    name,
                    slug
                )
            `)
            .eq("id", req.user.id)
            .single();

        if (error) throw error;

        return res.json({
            success: true,
            user: data
        });

    } catch (err) {

        console.error(err);

        return res.status(500).json({
            success: false,
            message: err.message
        });

    }
});
module.exports = router;