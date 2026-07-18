const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const { vote } = require("../controllers/voteController");

router.post("/:id", authenticateUser, vote);

module.exports = router;