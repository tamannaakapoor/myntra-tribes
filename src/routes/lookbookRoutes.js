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

module.exports = router;