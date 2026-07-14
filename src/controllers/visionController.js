const { analyzeImage } = require("../services/visionService");
const { matchProductsByTags } = require("../services/productMatchService");

const analyzeOutfitImage = async (req, res) => {
  try {
    const {
      imageUrl,
      imageBase64,
      mimeType,
      includeProducts = true,
      matchLimit = 12,
    } = req.body;

    if (!imageUrl && !imageBase64) {
      return res.status(400).json({
        success: false,
        message: "Either imageUrl or imageBase64 is required",
      });
    }

    if (imageUrl && imageBase64) {
      return res.status(400).json({
        success: false,
        message: "Provide only one of imageUrl or imageBase64",
      });
    }

    const result = await analyzeImage({ imageUrl, imageBase64, mimeType });

    const response = {
      success: true,
      message: result.fallback
        ? "Vision analysis unavailable; default tribe match applied"
        : "Image analyzed successfully",
      fallback: result.fallback,
      ...(result.fallback && { fallbackReason: result.fallbackReason }),
      provider: result.provider,
      model: result.model,
      ...result.analysis,
    };

    if (includeProducts) {
      try {
        response.matches = await matchProductsByTags(result.analysis, {
          limit: matchLimit,
        });
      } catch (matchErr) {
        console.error("Product matching failed:", matchErr.message);
        response.matches = { count: 0, products: [], error: matchErr.message };
      }
    }

    return res.status(200).json(response);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const matchProductsFromTags = async (req, res) => {
  try {
    const { moodKeywords, dominantColors, closestTribeMatch, tribeScores, limit } =
      req.body;

    if (!moodKeywords?.length) {
      return res.status(400).json({
        success: false,
        message: "moodKeywords is required",
      });
    }

    if (!closestTribeMatch?.slug) {
      return res.status(400).json({
        success: false,
        message: "closestTribeMatch.slug is required",
      });
    }

    const matches = await matchProductsByTags(
      { moodKeywords, dominantColors, closestTribeMatch, tribeScores },
      { limit: limit || 12 }
    );

    return res.status(200).json({
      success: true,
      message: "Products matched successfully",
      matches,
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
  analyzeOutfitImage,
  matchProductsFromTags,
};
