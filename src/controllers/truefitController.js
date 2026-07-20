const { supabase } = require("../config/supabase");

exports.saveTrueFit = async (req, res) => {
    try {
        const userId = req.user.id;

        const {
            height,
            weight,
            body_shape,
            fit_preference,
            top_size,
            bottom_size,
        } = req.body;

        // Validate required fields
        if (
            height == null ||
            weight == null ||
            !body_shape ||
            !fit_preference ||
            !top_size ||
            !bottom_size
        ) {
            return res.status(400).json({
                success: false,
                message: "All TrueFit fields are required.",
            });
        }

        const { data, error } = await supabase
            .from("profiles")
            .update({
                height,
                weight,
                body_shape,
                fit_preference,
                top_size,
                bottom_size,
            })
            .eq("id", userId)
            .select()
            .single();

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "TrueFit profile saved successfully.",
            profile: data,
        });

    } catch (error) {
        console.error("TrueFit Save Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to save TrueFit profile.",
        });
    }
};

exports.getTrueFit = async (req, res) => {
    try {
        const userId = req.user.id;

        const { data, error } = await supabase
            .from("profiles")
            .select(`
                height,
                weight,
                body_shape,
                fit_preference,
                top_size,
                bottom_size
            `)
            .eq("id", userId)
            .single();

        if (error) throw error;

        return res.status(200).json({
            success: true,
            profile: data,
        });

    } catch (error) {
        console.error("TrueFit Fetch Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch TrueFit profile.",
        });
    }
};