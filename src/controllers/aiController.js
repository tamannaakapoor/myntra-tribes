const { generateEditorial } = require("../services/aiService");

exports.generateAIEditorial = async (req, res) => {
  try {
    const { tribe, items } = req.body;

    const editorial = await generateEditorial(tribe, items);

    res.json({
      success: true,
      editorial,
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to generate editorial",
    });
  }
};