const groq = require("../config/groq");
const supabase = require("../config/supabase");

const { getMyLookbooks } = require("../services/lookbookService");

const chat = async (req, res) => {
    try {

        const { message } = req.body;
        const userId = req.user.id;

        // ==========================
        // Fetch User Profile
        // ==========================
        const { data: profile, error: profileError } = await supabase
            .from("profiles")
            .select("username, points, active_tribe_id")
            .eq("id", userId)
            .single();

        if (profileError) throw profileError;

        // ==========================
        // Fetch Tribe
        // ==========================
        let tribe = "Not Assigned";

        if (profile.active_tribe_id) {

            const { data: tribeData, error: tribeError } = await supabase
                .from("tribes")
                .select("name")
                .eq("id", profile.active_tribe_id)
                .single();

            if (tribeError) throw tribeError;

            tribe = tribeData?.name || "Not Assigned";
        }

        // ==========================
        // Fetch Recent Orders
        // ==========================
        const { data: orders, error: ordersError } = await supabase
            .from("orders")
            .select("total, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(5);

        if (ordersError) throw ordersError;

        // ==========================
        // Fetch User Lookbooks
        // ==========================
        const lookbooks = (await getMyLookbooks(userId)).slice(0, 5);

        // ==========================
        // AI Prompt
        // ==========================
        const systemPrompt = `
You are MynBot, the AI shopping and fashion assistant for TribeVibe.

You can answer questions about:

• Tribe
• Tribe Points
• Orders
• Lookbooks
• Fashion Advice
• Outfit Suggestions
• Shopping

Current User

Username:
${profile.username}

Current Tribe:
${tribe}

Available Tribe Points:
${profile.points}

Recent Orders:
${JSON.stringify(orders, null, 2)}

Recent Lookbooks:
${JSON.stringify(lookbooks, null, 2)}

Rules:

1. NEVER invent orders.
2. NEVER invent tribe points.
3. NEVER invent profile data.
4. Use only the information above for account questions.
5. If asked about styling, answer like an experienced fashion stylist.
6. Personalize styling according to the user's tribe whenever possible.
7. Keep replies short (under 120 words).
8. Be friendly and conversational.
`;

        // ==========================
        // Call Groq
        // ==========================
        const completion = await groq.chat.completions.create({
            model: "llama-3.3-70b-versatile",

            messages: [
                {
                    role: "system",
                    content: systemPrompt,
                },
                {
                    role: "user",
                    content: message,
                },
            ],

            temperature: 0.5,
        });

        return res.status(200).json({
            success: true,
            reply: completion.choices[0].message.content,
        });

    } catch (err) {

        console.error("Chat Error:", err);

        return res.status(500).json({
            success: false,
            message: err.message,
        });

    }
};

module.exports = {
    chat,
};