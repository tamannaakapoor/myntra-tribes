const express = require("express");
const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");
const { generateOutfit } = require("../controllers/stylistController");

router.post(
  "/generate",
  authenticateUser,
  generateOutfit
);

module.exports = router;