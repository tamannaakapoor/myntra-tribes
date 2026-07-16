const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  updateTribe,
} = require("../controllers/userController");

router.post(
  "/tribe",
  authenticateUser,
  updateTribe
);

module.exports = router;