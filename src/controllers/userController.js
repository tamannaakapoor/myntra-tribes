const userService = require("../services/userService");

const updateTribe = async (req, res) => {
  try {
    const { tribe_name } = req.body;

    if (!tribe_name) {
      return res.status(400).json({
        success: false,
        message: "tribe_name is required",
      });
    }

    const user = await userService.updateUserTribe(
      req.user.id,
      tribe_name
    );

    return res.status(200).json({
      success: true,
      message: "Tribe updated successfully",
      user,
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
  updateTribe,
};