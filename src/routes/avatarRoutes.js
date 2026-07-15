// const express = require("express");

// const router = express.Router();

// const authenticateUser = require("../middleware/authMiddleware");

// const { create } = require("../controllers/avatarController");

// router.post("/", authenticateUser, create);
// router.post("/create", authenticateUser, create);

// module.exports = router;
const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  createAvatar,
  getCurrentUserAvatar,
} = require("../controllers/avatarController");

router.post("/", authenticateUser, createAvatar);
router.post("/create", authenticateUser, createAvatar);
router.get("/me", authenticateUser, getCurrentUserAvatar);

module.exports = router;