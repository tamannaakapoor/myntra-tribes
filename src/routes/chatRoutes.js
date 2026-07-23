const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const { chat } = require("../controllers/chatController");

router.post("/", authenticateUser, chat);

module.exports = router;