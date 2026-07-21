const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const { generateAIEditorial } = require("../controllers/aiController");

router.post("/editorial", authenticateUser, generateAIEditorial);

module.exports = router;