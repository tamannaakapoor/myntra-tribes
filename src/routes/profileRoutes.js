const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  getUserProfile,
  updateUserProfile,
} = require("../controllers/profileController");

router.get("/me", authenticateUser, getUserProfile);

router.put("/me", authenticateUser, updateUserProfile);

module.exports = router;