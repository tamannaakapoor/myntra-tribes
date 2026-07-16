const express = require("express");

const router = express.Router();

const authenticateUser = require("../middleware/authMiddleware");

const {
  create,
  getMine,
  getById,
  getFeed,
} = require("../controllers/lookbookController");

// Create Lookbook
router.post("/", authenticateUser, create);
router.get("/me", authenticateUser, getMine);
router.get("/feed", getFeed);

router.get("/:id", getById);
module.exports = router;