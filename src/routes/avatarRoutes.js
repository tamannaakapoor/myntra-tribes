const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const { create } = require("../controllers/avatarController");

router.post("/", authenticateUser, create);
router.post("/create", authenticateUser, create);

module.exports = router;