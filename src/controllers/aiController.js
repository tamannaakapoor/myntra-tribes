const { generateCaption } = require("../services/aiService");

const autoWrite = async (req, res) => {
  try {
    const { items, tribe } = req.body;

    if (!items || !tribe) {
      return res.status(400).json({
        success: false,
        message: "items and tribe are required",
      });
    }

    const result = await generateCaption({
      items,
      tribe,
    });

    return res.status(200).json({
      success: true,
      ...result,
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
  autoWrite,
};