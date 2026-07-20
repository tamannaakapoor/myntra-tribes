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


router.post("/tribe", authenticateUser, async (req, res) => {
    try {

        const { tribe } = req.body;

        // Find tribe by name
        const { data: tribeRow, error: tribeError } = await supabase
            .from("tribes")
            .select("id, name")
            .eq("name", tribe)
            .single();

        if (tribeError) throw tribeError;

        // Update profile
        const { data: profile, error } = await supabase
            .from("profiles")
            .update({
                active_tribe_id: tribeRow.id
            })
            .eq("id", req.user.id)
            .select(`
                id,
                username,
                active_tribe_id
            `)
            .single();

        if (error) throw error;

        return res.json({
            success: true,
            profile
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