// const {
//   getAvatarByUserId,
//   createLookbook,
//   addLookbookItems,
//     getMyLookbooks,
//       getLookbookById,
//      getFeed: getFeedService,


// } = require("../services/lookbookService");
const { addPoints } = require("../services/pointService");

const {
  getAvatarByUserId,
  createLookbook,
  addLookbookItems,
  getMyLookbooks,
  getLookbookById,
  getFeed: getFeedService,
  likeLookbook,
  unlikeLookbook,
} = require("../services/lookbookService");
// POST /api/lookbooks
const create = async (req, res) => {
  try {
    const { title, description, tags, products } = req.body;

    // Validate input
    if (!title || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and products are required",
      });
    }

    // Find logged-in user's avatar
    const avatar = await getAvatarByUserId(req.user.id);

    // if (!avatar) {
    //   return res.status(404).json({
    //     success: false,
    //     message: "Avatar not found",
    //   });
    // }
    if (!avatar) {
  return res.status(404).json({
    success: false,
    message: "Please create an avatar first",
  });
}

    // Create lookbook
    const lookbook = await createLookbook({
      avatarId: avatar.id,
      title,
      description,
      tags: tags || [],
    });

    // Save selected products
    await addLookbookItems(lookbook.id, products);
    await addPoints(req.user.id, 20);

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

const getMine = async (req, res) => {
  try {
    const lookbooks = await getMyLookbooks(req.user.id);

    return res.status(200).json({
      success: true,
      count: lookbooks.length,
      lookbooks,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// const getById = async (req, res) => {
//   try {
//     const lookbook = await getLookbookById(req.params.id);

//     if (!lookbook) {
//       return res.status(404).json({
//         success: false,
//         message: "Lookbook not found",
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       lookbook,
//     });

//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };
const getById = async (req, res) => {
  try {
    const lookbook = await getLookbookById(req.params.id);

    if (!lookbook) {
      return res.status(404).json({
        success: false,
        message: "Lookbook not found",
      });
    }

    return res.status(200).json({
      success: true,
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

const getFeed = async (req, res) => {
  try {
    const { tribe } = req.query;

    const lookbooks = await getFeedService(tribe);

    return res.status(200).json({
      success: true,
      count: lookbooks.length,
      lookbooks,
    });

  } catch (err) {
    console.error(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const like = async (req,res)=>{

    try{

        // await lookbookService.likeLookbook(
        //     req.user.id,
        //     req.params.id
        // );
        await likeLookbook(
    req.user.id,
    req.params.id
);
        res.json({
            success:true,
            message:"Lookbook liked."
        });

    }catch(err){

        res.status(400).json({
            success:false,
            message:err.message
        });

    }

};

const unlike = async (req,res)=>{

    try{

        // await lookbookService.unlikeLookbook(
        //     req.user.id,
        //     req.params.id
        // );
        await unlikeLookbook(
    req.user.id,
    req.params.id
);

        res.json({
            success:true,
            message:"Lookbook unliked."
        });

    }catch(err){

        res.status(400).json({
            success:false,
            message:err.message
        });

    }

};
module.exports = {
  create,
  getMine,
  getById,
  getFeed,
  like,
  unlike,
};