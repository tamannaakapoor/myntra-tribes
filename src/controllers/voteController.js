const { voteLookbook } = require("../services/voteService");

const vote = async (req, res) => {
    try {

        await voteLookbook(req.user.id, req.params.id);

        res.json({
            success: true,
            message: "Vote successful."
        });

    } catch (err) {

        res.status(400).json({
            success: false,
            message: err.message,
        });

    }
};

module.exports = { vote };