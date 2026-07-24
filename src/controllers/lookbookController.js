// // const {
// //   getAvatarByUserId,
// //   createLookbook,
// //   addLookbookItems,
// //     getMyLookbooks,
// //       getLookbookById,
// //      getFeed: getFeedService,


// // } = require("../services/lookbookService");
// const supabase = require("../config/supabase");
// const { addPoints } = require("../services/pointService");

// const {
//   getAvatarByUserId,
//   createLookbook,
//   addLookbookItems,
//   getMyLookbooks,
//   getLookbookById,
//   getFeed: getFeedService,
//   likeLookbook,
//   unlikeLookbook,
//   addComment,
//   getComments,
// } = require("../services/lookbookService");
// // POST /api/lookbooks


// const create = async (req, res) => {
//   try {
//     // const { title, description, tags, products } = req.body;
//     const { title, description, tags, products, tribe } = req.body;
//     if (!title || !products || products.length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "Title and products are required",
//       });
//     }

//     // Find user's avatar
//     const avatar = await getAvatarByUserId(req.user.id);

//     if (!avatar) {
//       return res.status(404).json({
//         success: false,
//         message: "Please create an avatar first",
//       });
//     }

//     // Get user's active tribe
//     // const { data: profile, error: profileError } = await supabase
//     //   .from("profiles")
//     //   .select("active_tribe_id")
//     //   .eq("id", req.user.id)
//     //   .single();

//     // if (profileError) throw profileError;

//     // if (!profile.active_tribe_id) {
//     //   return res.status(400).json({
//     //     success: false,
//     //     message: "User has not joined a tribe yet.",
//     //   });
//     // }
//     if (!tribe) {
//   return res.status(400).json({
//     success: false,
//     message: "Tribe is required",
//   });
// }

// const { data: tribeData, error: tribeError } = await supabase
//   .from("tribes")
//   .select("id")
//   .eq("slug", tribe)
//   .single();

// if (tribeError || !tribeData) {
//   return res.status(400).json({
//     success: false,
//     message: "Invalid tribe",
//   });
// }

//     // Create lookbook
//     // const lookbook = await createLookbook({
//     //   avatarId: avatar.id,
//     //   tribeId: profile.active_tribe_id,
//     //   title,
//     //   description,
//     //   tags: tags || [],
//     // });
//     const lookbook = await createLookbook({
//   avatarId: avatar.id,
//   tribeId: tribeData.id,
//   title,
//   description,
//   tags: tags || [],
// });

//     // Save products
//     await addLookbookItems(lookbook.id, products);

//     // Award points
//     await addPoints(req.user.id, 20);

//     return res.status(201).json({
//       success: true,
//       message: "Lookbook created successfully",
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
// const getMine = async (req, res) => {
//   try {
//     const lookbooks = await getMyLookbooks(req.user.id);

//     return res.status(200).json({
//       success: true,
//       count: lookbooks.length,
//       lookbooks,
//     });

//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// // const getById = async (req, res) => {
// //   try {
// //     const lookbook = await getLookbookById(req.params.id);

// //     if (!lookbook) {
// //       return res.status(404).json({
// //         success: false,
// //         message: "Lookbook not found",
// //       });
// //     }

// //     return res.status(200).json({
// //       success: true,
// //       lookbook,
// //     });

// //   } catch (err) {
// //     console.error(err);

// //     return res.status(500).json({
// //       success: false,
// //       message: err.message,
// //     });
// //   }
// // };
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

// const getFeed = async (req, res) => {
//   try {
//     const { tribe } = req.query;

//     const lookbooks = await getFeedService(tribe);

//     return res.status(200).json({
//       success: true,
//       count: lookbooks.length,
//       lookbooks,
//     });

//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const like = async (req,res)=>{

//     try{

//         // await lookbookService.likeLookbook(
//         //     req.user.id,
//         //     req.params.id
//         // );
//         await likeLookbook(
//     req.user.id,
//     req.params.id
// );
//         res.json({
//             success:true,
//             message:"Lookbook liked."
//         });

//     }catch(err){

//         res.status(400).json({
//             success:false,
//             message:err.message
//         });

//     }

// };

// const unlike = async (req,res)=>{

//     try{

//         // await lookbookService.unlikeLookbook(
//         //     req.user.id,
//         //     req.params.id
//         // );
//         await unlikeLookbook(
//     req.user.id,
//     req.params.id
// );

//         res.json({
//             success:true,
//             message:"Lookbook unliked."
//         });

//     }catch(err){

//         res.status(400).json({
//             success:false,
//             message:err.message
//         });

//     }

// };
// const toggleLike = async (req, res) => {
//   try {
//     const userId = req.user.id;
//     const lookbookId = req.params.id;

//     const { data: existingLike, error } = await supabase
//       .from("lookbook_likes")
//       .select("user_id")
//       .eq("user_id", userId)
//       .eq("lookbook_id", lookbookId)
//       .maybeSingle();

//     if (error) throw error;

//     if (existingLike) {
//       await unlikeLookbook(userId, lookbookId);

//       return res.status(200).json({
//         success: true,
//         liked: false,
//         message: "Lookbook unliked",
//       });
//     }

//     await likeLookbook(userId, lookbookId);

//     return res.status(200).json({
//       success: true,
//       liked: true,
//       message: "Lookbook liked",
//     });

//   } catch (err) {
//     console.error(err);

//     return res.status(500).json({
//       success: false,
//       message: err.message,
//     });
//   }
// };

// const postComment = async (req, res) => {

//     try {

//         const lookbookId = req.params.id;
//         const userId = req.user.id;
//         const { text } = req.body;

//         if (!text || !text.trim()) {

//             return res.status(400).json({
//                 success: false,
//                 message: "Comment cannot be empty",
//             });

//         }

//         const comment = await addComment(
//             lookbookId,
//             userId,
//             text
//         );

//         return res.status(201).json({
//             success: true,
//             comment,
//         });

//     } catch (err) {

//         console.error(err);

//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });

//     }

// };
// const getLookbookComments = async (req, res) => {

//     try {

//         const comments = await getComments(req.params.id);

//         return res.json({
//             success: true,
//             count: comments.length,
//             comments,
//         });

//     } catch (err) {

//         console.error(err);

//         return res.status(500).json({
//             success: false,
//             message: err.message,
//         });

//     }

// };
// module.exports = {
//   create,
//   getMine,
//   getById,
//   getFeed,
//   like,
//   unlike,
//   toggleLike,
//   postComment,
//   getLookbookComments,
// };
const supabase = require("../config/supabase");
const { addPoints } = require("../services/pointService");

const {
  createLookbook,
  addLookbookItems,
  getMyLookbooks,
  getLookbookById,
  getFeed: getFeedService,
  likeLookbook,
  unlikeLookbook,
  addComment,
  getComments,
} = require("../services/lookbookService");

const create = async (req, res) => {
  try {
    const { title, description, tags, products, tribe } = req.body;
    
    if (!title || !products || products.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Title and products are required",
      });
    }

    if (!tribe) {
      return res.status(400).json({
        success: false,
        message: "Tribe is required",
      });
    }

    const { data: tribeData, error: tribeError } = await supabase
      .from("tribes")
      .select("id")
      .eq("slug", tribe)
      .single();

    if (tribeError || !tribeData) {
      return res.status(400).json({
        success: false,
        message: "Invalid tribe",
      });
    }

    // --- AVATAR CHECK REMOVED COMPLETELY ---
    // Now we pass userId directly
    const lookbook = await createLookbook({
      userId: req.user.id, 
      tribeId: tribeData.id,
      title,
      description,
      tags: tags || [],
    });

    // Save products
    await addLookbookItems(lookbook.id, products);

    // Award points
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

const like = async (req, res) => {
  try {
    await likeLookbook(req.user.id, req.params.id);
    res.json({
      success: true,
      message: "Lookbook liked.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const unlike = async (req, res) => {
  try {
    await unlikeLookbook(req.user.id, req.params.id);
    res.json({
      success: true,
      message: "Lookbook unliked.",
    });
  } catch (err) {
    res.status(400).json({
      success: false,
      message: err.message,
    });
  }
};

const toggleLike = async (req, res) => {
  try {
    const userId = req.user.id;
    const lookbookId = req.params.id;

    const { data: existingLike, error } = await supabase
      .from("lookbook_likes")
      .select("user_id")
      .eq("user_id", userId)
      .eq("lookbook_id", lookbookId)
      .maybeSingle();

    if (error) throw error;

    if (existingLike) {
      await unlikeLookbook(userId, lookbookId);
      return res.status(200).json({
        success: true,
        liked: false,
        message: "Lookbook unliked",
      });
    }

    await likeLookbook(userId, lookbookId);
    return res.status(200).json({
      success: true,
      liked: true,
      message: "Lookbook liked",
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const postComment = async (req, res) => {
  try {
    const lookbookId = req.params.id;
    const userId = req.user.id;
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({
        success: false,
        message: "Comment cannot be empty",
      });
    }

    const comment = await addComment(lookbookId, userId, text);
    return res.status(201).json({
      success: true,
      comment,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

const getLookbookComments = async (req, res) => {
  try {
    const comments = await getComments(req.params.id);
    return res.json({
      success: true,
      count: comments.length,
      comments,
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
  getMine,
  getById,
  getFeed,
  like,
  unlike,
  toggleLike,
  postComment,
  getLookbookComments,
};