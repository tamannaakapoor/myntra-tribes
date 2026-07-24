// const express = require("express");

// const router = express.Router();

// const authenticateUser = require("../middleware/authMiddleware");

// const {
//   create,
//   getMine,
//   getById,
//   getFeed,
// } = require("../controllers/lookbookController");

// // Create Lookbook
// router.post("/", authenticateUser, create);
// router.get("/me", authenticateUser, getMine);
// router.get("/feed", getFeed);

// router.get("/:id", getById);
// module.exports = router;
const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  create,
  getMine,
  getById,
  getFeed,
  like,
  unlike,
   toggleLike,
  postComment,
  getLookbookComments,
} = require("../controllers/lookbookController");

// Public feed
router.get("/", getFeed);

// Create lookbook
router.post("/", authenticateUser, create);

// User's lookbooks
router.get("/me", authenticateUser, getMine);

// Keep /feed for backward compatibility
router.get("/feed", getFeed);

// Single lookbook
router.get("/:id", getById);

router.post("/:id/like",authenticateUser,like);

router.delete("/:id/like",authenticateUser,unlike);
router.post(
  "/:id/toggle-like",
  authenticateUser,
  toggleLike
);
router.post(
    "/:id/comments",
    authenticateUser,
    postComment
);

router.get(
    "/:id/comments",
    getLookbookComments
);
module.exports = router;