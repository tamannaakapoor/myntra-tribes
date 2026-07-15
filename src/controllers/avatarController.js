const { createAvatar } = require("../services/avatarService");

const create = async (req, res) => {

  try {

    // const { name } = req.body;
    const {
    name,
    gender,
    hair,
    skin_color,
    body_type
} = req.body;

    // if (!name) {
    //   return res.status(400).json({
    //     success: false,
    //     message: "Avatar name is required",
    //   });
    // }
    if (
    !name ||
    !gender ||
    !hair ||
    !skin_color ||
    !body_type
) {
    return res.status(400).json({
        success:false,
        message:"All avatar fields are required"
    });
}

      const avatar = await createAvatar({
  userId: req.user.id,
  name,
  hair,
  skin_color,
  body_type
});


    return res.status(201).json({

      success: true,

      message: "Avatar created successfully",

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
  create,
};