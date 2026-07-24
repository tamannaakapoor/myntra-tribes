const { generateStylistResponse } = require("../services/stylistService");

const generateOutfit = async (req, res) => {
  try {
    const { occasion, budget, weather } = req.body;

    if (!occasion || !budget) {
      return res.status(400).json({
        success: false,
        message: "Occasion and budget are required.",
      });
    }

    const userId = req.user.id;

    const outfit = await generateStylistResponse({
      userId,
      occasion,
      budget,
      weather,
    });

    return res.status(200).json({
      success: true,
      outfit,
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
  generateOutfit,
};