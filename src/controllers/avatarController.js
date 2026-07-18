const {
  createAvatar: createAvatarService,
  getMyAvatar,
} = require("../services/avatarService");
const { addPoints } = require("../services/pointService");
const createAvatar = async (req, res) => {
  try {
    const {
      name,
      gender,
      hair,
      skin_color,
      body_type,
    } = req.body;

    if (
      !name ||
      !gender ||
      !hair ||
      !skin_color ||
      !body_type
    ) {
      return res.status(400).json({
        success: false,
        message: "All avatar fields are required",
      });
    }

    const { avatar, isNew } = await createAvatarService({
  userId: req.user.id,
  name,
  gender,
  hair,
  skin_color,
  body_type,
});

if (isNew) {
  await addPoints(req.user.id, 20);
}
        await addPoints(req.user.id, 20);

    return res.status(201).json({
      success: true,
      message: "Avatar created successfully",
      avatar: {
        id: avatar.id,
        user_id: avatar.user_id,
        name: avatar.name,
        gender: avatar.gender,
        hair: avatar.hair,
        skin_color: avatar.skin_color,
        body_type: avatar.body_type,
      },
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
const getCurrentUserAvatar = async (req, res) => {
  try {
    const avatar = await getMyAvatar(req.user.id);

    return res.status(200).json({
      success: true,
      avatar,
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
  createAvatar,
  getCurrentUserAvatar,
};