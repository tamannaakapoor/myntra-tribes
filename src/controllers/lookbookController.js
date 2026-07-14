const { saveLookbook } = require("../services/lookbookService");

const createLookbook = async (req, res) => {
  try {

    const {
      avatarId,
      title,
      description,
      tags,
      items,
    } = req.body;
if (tags && !Array.isArray(tags)) {
    return res.status(400).json({
        success: false,
        message: "tags must be an array",
    });
}
    if (!avatarId) {
      return res.status(400).json({
        success: false,
        message: "avatarId is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        success: false,
        message: "title is required",
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "At least one product is required",
      });
    }

    const lookbook = await saveLookbook({
      avatarId,
      title,
      description,
      tags,
      items,
    });

    return res.status(201).json({
      success: true,
      message: "Lookbook created successfully",
      lookbook,
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
  createLookbook,
};