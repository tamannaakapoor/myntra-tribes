const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const { autoWriteEditorial } = require("../controllers/aiController");

router.post("/editorial", authenticateUser, autoWriteEditorial);

module.exports = router;