const { generateEditorial } = require("../services/aiService");

const autoWriteEditorial = async (req, res) => {
    try {
        const { items, tribe } = req.body;

        if (!items || !tribe) {
            return res.status(400).json({
                success: false,
                message: "Items and tribe are required"
            });
        }

        const editorial = await generateEditorial(items, tribe);

        res.json({
            success: true,
            editorial
        });

    } catch (err) {
        console.error(err);

        res.status(500).json({
            success: false,
            message: err.message
        });
    }
};

module.exports = {
    autoWriteEditorial
};